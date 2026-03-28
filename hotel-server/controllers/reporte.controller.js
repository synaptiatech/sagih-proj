import {
	getFromQuery,
	getFromQueryCopy,
	getOneCopy,
	getQueryMethod,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import { switchDateToEng } from '../utils/formatos.js';
import {
	calcSumatoria,
	createDocument,
	getCellsAlign,
	getCustomWhere,
	getDaysInMonth,
	getEmptyRow,
	getReportCriterio,
	setupLetterhead,
	setupPagesNumber,
	writeHead,
} from '../utils/reporte.utils.js';

/**
 * Generar reporte de maestro detalle
 * @param {import('express').Request} req Request de la petición
 * @param {import('express').Response} res Respuesta de la petición
 */
export const masterDetail = async ({ query, body, user }, res) => {
	try {
		const { name, masterColumns, detailColumns } = body;

		const { rows, count } = await getQueryMethod({
			...body,
			query,
		});

		if (count == 0 || rows.length === 0) {
			// mostrar columnas vacias
			const emptyRow = getEmptyRow(body.columns);

			// Object.keys(body.columns).forEach((columna) => {
			// 	emptyRow[columna] = '';
			// });
			rows.push(emptyRow);
		}

		const strCriterio = Object.entries(query).map(([key, value]) => {
			return `${key}: ${value}`;
		});
		const title = `Reporte de ${name.toLowerCase()}`;
		const criterio = `Criterio: ${
			strCriterio.join(', ') || 'Todos los registros'
		}`;

		const columns = detailColumns ? detailColumns : body.columns;

		const stream = writeHead(name, res);
		const doc = createDocument(Object.keys(columns).length);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		await setupLetterhead(doc, user.usuario, title, criterio);

		if (masterColumns) {
			const masterHeaders = Object.entries(masterColumns).map(
				([key, label]) => {
					return {
						key,
						label,
						align: 'center',
					};
				}
			);

			doc.addTable(masterHeaders, [rows.at(0)], {
				fontSize: 12,
				width: 'fill_body',
				headBackground: '#f2f2f2',
				headStyles: {
					fillColor: '#f2f2f2',
					textColor: '#000',
					lineColor: '#000',
				},
			});
		}

		const detailHeaders = Object.entries(columns).map(([key, label]) => {
			return {
				key,
				label,
				align: getCellsAlign(key),
			};
		});

		doc.addTable(detailHeaders, rows, {
			fontSize: 12,
			width: 'fill_body',
		});

		if (Object.keys(body.sumatoria).length > 0) {
			// mostrar sumatoria
			const { cabecera, objetoSuma } = calcSumatoria(
				columns,
				body.sumatoria,
				rows
			);

			doc.addTable(cabecera, [objetoSuma], {
				fontSize: 12,
				border: {
					size: 0,
					color: '#fff',
				},
				width: 'fill_body',
				headBackground: '#f2f2f2',
				headColor: '#f2f2f2',
				headHeight: 0.5,
				cellsFont: 'Helvetica-Bold',
			});
		}

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

// Reemplazo de reporteTransaccion por reporte cierreTurno
export const cierreTurno = async ({ query, body, user }, res) => {
    try {
        // ============================================================
        // 1. VALIDACIONES INICIALES
        // ============================================================
        const fecha_apertura = query.fecha_apertura;
        const fecha_cierre_raw = query.fecha_cierre_turno;
        const fecha_real_raw = query.fecha_cierre;

        if (!fecha_apertura || !fecha_cierre_raw || !fecha_real_raw) {
            throw new Error('Fechas requeridas para generar el reporte');
        }

        const fecha_cierre = `${fecha_cierre_raw}`.replace('T', ' ');
        const fecha_real = fecha_real_raw;

        // ============================================================
        // 2. TODAS LAS CONSULTAS ANTES DEL PDF
        // ============================================================
        
        // 2.1 Consulta principal de tipos de pago
        const consultaPrincipal = `
            SELECT 
                sum(monto) monto, 
                nombre
            FROM (
                SELECT 
                    sum(dr.monto) as monto, 
                    tp.nombre 
                FROM detalle_recibo dr 
                INNER JOIN tipo_pago tp ON dr.tipo_pago = tp.codigo
                WHERE dr.fecha::timestamp >= $1::timestamp 
                    AND dr.fecha::timestamp <= $2::timestamp 
                GROUP BY tp.nombre 
                UNION 
                SELECT 0 as monto, tp2.nombre 
                FROM tipo_pago tp2 
            ) rc
            GROUP BY nombre
            ORDER BY rc.nombre ASC`;

        const { rows: tiposRows } = await getFromQueryCopy({
            query: consultaPrincipal,
            valores: [fecha_apertura, fecha_cierre],
        });

        // 2.2 Consulta de compras
        const consultaCompras = `
            SELECT total
            FROM pp_tranenc
            WHERE fecha::timestamp >= $1::timestamp 
                AND fecha::timestamp <= $2::timestamp`;

        const { rows: comprasRows } = await getFromQueryCopy({
            query: consultaCompras,
            valores: [fecha_apertura, fecha_cierre],
        });

        // 2.3 Tipos de pago para detalles
        const tipos = await getQueryMethod({
            table: 'tipo_pago',
            columns: { nombre: 'Nombre', codigo: 'Código' },
        });

        // 2.4 Detalles por tipo de pago (paralelo para performance)
        const detallesPorTipo = await Promise.all(
            tipos.rows.map(async (item) => {
                const consultaDetalle = `
                    SELECT DISTINCT *
                    FROM v_rc_detalle
                    WHERE tp_nombre = $1
                        AND eng_fecha::timestamp >= $2::timestamp 
                        AND eng_fecha::timestamp <= $3::timestamp`;

                const { rows } = await getFromQueryCopy({
                    query: consultaDetalle,
                    valores: [item.nombre, fecha_apertura, fecha_cierre],
                });
                
                return { tipo: item.nombre, rows };
            })
        );

        // 2.5 Compras detalladas
        const shopResults = await getFromQuery({
            sql: `SELECT 
                CONCAT(pt.serie, '-', pt.tipo_transaccion, '-', pt.documento) AS documento,
                TO_CHAR(pt.fecha, 'DD/MM/YYYY') AS str_fecha,
                pt.fecha, 
                pt.descripcion, 
                p.nombre, 
                p.telefono, 
                p.nit,  
                'Q.' || TO_CHAR(pt.iva, '999G999D99') AS iva, 
                'Q.' || TO_CHAR(pt.total, '999G999D99') AS total  
            FROM pp_tranenc pt 
            INNER JOIN proveedor p ON pt.proveedor = p.codigo
            WHERE pt.fecha::timestamp >= $1::timestamp 
                AND pt.fecha::timestamp <= $2::timestamp`,
            values: [fecha_apertura, fecha_cierre],
        });

        // ============================================================
        // 3. CÁLCULOS Y PROCESAMIENTO DE DATOS
        // ============================================================
        
        const columns = {
            descripcion: 'DESCRIPCION',
            fecha: 'FECHA',
            hora: 'HORA',
            habitacion: 'HAB.',
            tp_nombre: 'TIPO DE PAGO',
            monto: 'MONTO',
        };

        // Helper: formateo seguro de moneda
        const formatCurrency = (value) => {
            const numericValue = Number(value) || 0;
            return Intl.NumberFormat('es-GT', {
                style: 'currency',
                currency: 'GTQ',
            }).format(numericValue);
        };

        // Helper: extraer número de string de moneda
        const getNumericValue = (currencyString) => {
            if (!currencyString) return 0;
            const cleaned = String(currencyString)
                .replace(/[Q.,]/g, '')
                .replace(/^\s+|\s+$/g, '');
            return Number(cleaned) || 0;
        };

        // Procesar filas de tipos
        const reportRows = tiposRows.map((r) => ({
            nombre: r.nombre,
            monto: formatCurrency(r.monto),
        }));

        // Total de tipos de pago
        const { objetoSuma: totalTiposObj } = calcSumatoria(
            { monto: 'monto' },
            { monto: 'monto' },
            reportRows
        );
        const totalTipos = Object.values(totalTiposObj)[0];
        reportRows.push({ monto: totalTipos, nombre: 'Total' });

        // Total de compras
        const { objetoSuma: totalComprasObj } = calcSumatoria(
            { total: 'total' },
            { total: 'total' },
            comprasRows
        );
        const totalCompras = Object.values(totalComprasObj)[0] || 'Q0.00';

        // Buscar efectivo
        const efectivo = reportRows.find(
            (r) => r.nombre?.toLowerCase() === 'efectivo'
        );

        const efectivoNumero = efectivo ? getNumericValue(efectivo.monto) : 0;
        const comprasNumero = getNumericValue(totalCompras);
        const totalLiquidar = efectivoNumero - comprasNumero;

        reportRows.push({
            monto: formatCurrency(totalLiquidar),
            nombre: 'TOTAL A LIQUIDAR (Efectivo - Compras)',
        });

        // ============================================================
        // 4. CREAR PDF (SOLO DESPUÉS DE TENER TODOS LOS DATOS)
        // ============================================================
        
        const stream = writeHead('CIERRE DE TURNO', res);
        const doc = createDocument(Object.keys({ tipo: 'Tipo', monto: 'Monto' }).length);

        let hasError = false;
        
        doc.on('data', (data) => {
            if (!hasError && stream && !stream.writableEnded) {
                stream.write(data);
            }
        });
        
        doc.on('error', (err) => {
            hasError = true;
            console.error('PDF generation error:', err);
            if (stream && !stream.writableEnded) {
                stream.end();
            }
        });
        
        doc.on('end', () => {
            if (stream && !stream.writableEnded && !hasError) {
                stream.end();
            }
        });

        await setupLetterhead(doc, user.usuario, 'CIERRE DE TURNO');

        // Tabla de fechas
        doc.addTable(
            [
                { key: 'fecha_apertura', label: 'Fecha inicio', align: 'center' },
                { key: 'fecha_cierre', label: 'Fecha cierre', align: 'center' },
                { key: 'fecha_real', label: 'Fecha real', align: 'center' },
            ],
            [{
                fecha_apertura: switchDateToEng(fecha_apertura),
                fecha_real: switchDateToEng(fecha_real),
                fecha_cierre: switchDateToEng(fecha_cierre),
            }],
            {
                fontSize: 12,
                width: 'fill_body',
                headBackground: '#f2f2f2',
                headStyles: {
                    fillColor: '#f2f2f2',
                    textColor: '#000',
                    lineColor: '#000',
                },
            }
        );

        // Tabla resumen de pagos
        const detailHeaders = Object.entries({
            nombre: 'Tipo',
            monto: 'Monto',
        }).map(([key, label]) => ({
            key,
            label,
            align: getCellsAlign(key),
        }));

        doc.addTable(detailHeaders, reportRows, {
            fontSize: 12,
            width: 'fill_body',
        });

        // Detalles por tipo de pago
        const emptyDetailRow = getEmptyRow({
            serie: 'Serie',
            tipo_transaccion: 'Tipo',
            documento: 'Documento',
            serie_fac: 'Serie Fac.',
            ti_tran_fac: 'Tipo Fac.',
            documento_fac: 'Documento Fac.',
            eng_fecha: '',
            fecha: 'Fecha',
            hora: 'Hora',
            habitacion: 'Habitacion',
            abono: 'Abono',
            descripcion: 'Descripción',
            monto: 'Monto',
            tipo_pago: 'Tipo de Pago',
            tp_nombre: 'Tipo de Pago',
            cliente: 'Cliente',
            c_nombre: 'Cliente',
            cobrador: 'Cobrador',
            v_nombre: 'Vendedor',
        });

        for (const { tipo, rows: detalleRows } of detallesPorTipo) {
            const rowsToDisplay = detalleRows.length === 0 ? [emptyDetailRow] : detalleRows;

            doc.addTable(
                [{ key: 'tp_nombre', label: '', align: 'right' }],
                [{ tp_nombre: tipo }],
                {
                    fontSize: 14,
                    headBackground: '#ffffff',
                    border: { size: 0, color: '#ffffff' },
                    cellsFont: 'Helvetica-Bold',
                }
            );

            const detallesHeaders = Object.entries(columns).map(([key, label]) => ({
                key,
                label,
                align: getCellsAlign(key),
            }));

            doc.addTable(detallesHeaders, rowsToDisplay, {
                fontSize: 12,
                width: 'fill_body',
            });

            const { cabecera, objetoSuma } = calcSumatoria(
                columns,
                { monto: 'monto' },
                rowsToDisplay
            );
            
            cabecera.forEach((el) => { el.label = ''; });
            
            doc.addTable(cabecera, [objetoSuma], {
                fontSize: 12,
                border: { size: 0, color: '#fff' },
                width: 'fill_body',
                headBackground: '#f2f2f2',
                headColor: '#f2f2f2',
                headHeight: 0.5,
                cellsFont: 'Helvetica-Bold',
            });
        }

        // Compras detalladas
        const emptyShopRow = getEmptyRow({
            documento: 'Documento',
            str_fecha: 'Fecha',
            descripcion: 'Descripción',
            nombre: 'Proveedor',
            telefono: 'Teléfono',
            nit: 'NIT',
            iva: 'IVA',
            total: 'Total',
        });

        const shopRowsToDisplay = shopResults.length === 0 ? [emptyShopRow] : shopResults;

        doc.addTable(
            [{ key: 'pp_tranenc', label: '', align: 'left' }],
            [{ pp_tranenc: 'Compras' }],
            {
                fontSize: 14,
                headBackground: '#ffffff',
                border: { size: 0, color: '#ffffff' },
                cellsFont: 'Helvetica-Bold',
            }
        );

        doc.addTable(
            [
                { key: 'documento', label: 'Documento', align: 'left' },
                { key: 'str_fecha', label: 'Fecha', align: 'left' },
                { key: 'descripcion', label: 'Descripción', align: 'left' },
                { key: 'nombre', label: 'Proveedor', align: 'left' },
                { key: 'telefono', label: 'Teléfono', align: 'left' },
                { key: 'nit', label: 'NIT', align: 'left' },
                { key: 'iva', label: 'IVA', align: 'right' },
                { key: 'total', label: 'Total', align: 'right' },
            ],
            shopRowsToDisplay,
            { fontSize: 12, width: 'fill_body' }
        );

        const { cabecera: comprasCabecera, objetoSuma: comprasTotal } = calcSumatoria(
            {
                documento: 'documento',
                str_fecha: 'str_fecha',
                descripcion: 'descripcion',
                nombre: 'nombre',
                telefono: 'telefono',
                nit: 'nit',
                iva: 'iva',
                total: 'total',
            },
            { total: 'total' },
            shopRowsToDisplay
        );
        
        comprasCabecera.forEach((el) => { el.label = ''; });
        
        doc.addTable(comprasCabecera, [comprasTotal], {
            fontSize: 12,
            border: { size: 0, color: '#fff' },
            width: 'fill_body',
            headBackground: '#f2f2f2',
            headColor: '#f2f2f2',
            headHeight: 0.5,
            cellsFont: 'Helvetica-Bold',
        });

        doc.render();
        doc.moveDown(2);

        // Firmas
        doc.text('___________________________', 100, doc.y, {
            width: 200,
            align: 'center',
        });
        doc.moveUp();
        doc.text('___________________________', 300, doc.y, {
            width: 200,
            align: 'center',
        });

        doc.moveDown();
        doc.text(user?.usuario || 'Usuario', 100, doc.y, {
            width: 200,
            align: 'center',
        });
        doc.moveUp();
        doc.text('________________', 300, doc.y, {
            width: 200,
            align: 'center',
        });

        doc.text('Responsable', 100, doc.y, {
            width: 200,
            align: 'center',
        });
        doc.moveUp();
        doc.text('Recibido', 300, doc.y, {
            width: 200,
            align: 'center',
        });

        doc.moveDown();
        doc.text('Observaciones:', 50, doc.y, { align: 'left' });
        
        const line = '_________________________________________________________________________________________';
        for (let i = 0; i < 4; i++) {
            doc.moveDown().text(line, 50, doc.y, { width: 500, align: 'center' });
        }

        setupPagesNumber(doc);
        doc.flushPages();
        doc.end();
        
    } catch (error) {
        console.error('❌ Error en cierreTurno:', error);
        
        if (!res.headersSent) {
            errorHandler(res, error);
        } else {
            console.error('Headers ya enviados, no se puede enviar error');
            if (!res.writableEnded) {
                res.end();
            }
        }
    }
};

// cambios para generar reporte con pdfkit y mostrar sumatoria
export const getReporte = async ({ body, user }, res) => {
	try {
		const { name, table, columns, encColumns, detColumns, where } = body;
		const { query, valores } = await getOneCopy(table, body.where);
		// console.log('-> Generando reporte:', body);

		const { rows } = await getFromQueryCopy({
			query,
			valores,
		});

		if (rows.length === 0) {
			const emptyRow = getEmptyRow(body.columns);

			rows.push(emptyRow);
		}
		const stream = writeHead(name, res);

		const title = `Reporte de ${name.toLowerCase()}`;
		const criterio = ``;

		const doc = createDocument(Object.keys(detColumns).length);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		await setupLetterhead(doc, user.usuario, title, criterio);

		for (let i = 0; i < rows.length; i++) {
			if (encColumns) {
				const masterHeaders = Object.entries(encColumns).map(
					([key, label]) => {
						return {
							key,
							label,
							align: 'center',
						};
					}
				);

				doc.addTable(masterHeaders, [rows.at(i)], {
					fontSize: 12,
					width: 'fill_body',
					headBackground: '#f2f2f2',
					headStyles: {
						fillColor: '#f2f2f2',
						textColor: '#000',
						lineColor: '#000',
					},
				});
			}

			const detailHeaders = Object.entries(detColumns).map(
				([key, label]) => {
					return {
						key,
						label,
						align: getCellsAlign(key),
					};
				}
			);

			doc.addTable(detailHeaders, [rows.at(i)], {
				fontSize: 12,
				width: 'fill_body',
			});

			if (Object.key(body.sumatoria).length > 0) {
				const { cabecera, objetoSuma } = calcSumatoria(
					detColumns,
					body.sumatoria,
					[rows.at(i)]
				);

				doc.addTable(cabecera, [objetoSuma], {
					fontSize: 12,
					border: {
						size: 0,
						color: '#fff',
					},
					width: 'fill_body',
					headBackground: '#f2f2f2',
					headColor: '#f2f2f2',
					headHeight: 0.5,
					cellsFont: 'Helvetica-Bold',
				});
			}
		}

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

const operadorPorRelacion = (relacion) => {
	switch (relacion) {
		case 'igual':
			return '=';
		case 'mayor':
			return '>';
		case 'menor':
			return '<';
		case 'mayor igual':
			return '>=';
		case 'menor igual':
			return '<=';
		case 'diferente':
			return '<>';
		case 'contiene':
			return 'LIKE';
		default:
			return relacion;
	}
};

/**
 * Organizar la consulta para el reporte parametrizado
 * @param {Object[]} querys Arreglo de objetos con los datos de la consulta
 * @returns Cadena de texto con la consulta
 */
const unirWhere = (querys) => {
	let where = '';
	let count = 0;
	querys.forEach((item, _index) => {
		if (item.valor !== '') {
			where += `${item.columna} ${operadorPorRelacion(
				item.relacion
			)} $${++count} AND `;
		}
	});
	return where.substring(0, where.length - 4);
};

/**
 * Armar arreglo con los valores de la consulta
 * @param {Object[]} querys Arreglo de objetos con los datos de la consulta
 * @returns Arreglo con los valores de la consulta
 */
const obtenerValores = (querys) => {
	let valores = [];
	querys.forEach((item) => {
		if (item.valor !== '') valores = [...valores, item.valor];
	});
	return valores;
};

/**
 * Get criterio from querys
 * @param {{columna: string, relacion: string, valor: any}[]} querys Array of objects with the query data
 * @returns string
 */
const obtenerDescripcionReporte = (querys) => {
	return querys
		.filter((item) => item.valor !== '')
		.map((item) => `${item.columna} ${item.relacion} ${item.valor}`)
		.join(' y ');
};

/**
 * Obtener los días de un mes
 * @param {String} fecha Fecha en formato yyyy-mm
 * @returns Arreglo con los días del mes
 */
const obtenerDiasMes = (fecha) => {
	let [year, month] = fecha.split('-');
	let dias = [];

	let ultimoDia = new Date(year, month, 0).getDate();

	for (let i = 1; i <= ultimoDia; i++) {
		dias.push(`${year}-${month}-${i}`);
	}
	return dias;
};
// cambios para generar reporte parametrizado con pdfkit y mostrar sumatoria
export const getReporteParametrizado = async ({ body, query, user }, res) => {
	try {
		const { name, table, columns, customWhere } = body;
		console.log('**************');
		console.log({ customWhere });
		console.log('**************');

		const { query, values } = await getOneCopy(table, customWhere, columns);

		console.log({ query, values });

		const rows = await getFromQuery({
			sql: query,
			values: values,
		});

		if (rows.length === 0) {
			const emptyRow = getEmptyRow(body.columns);

			rows.push(emptyRow);
		}

		console.log('First row', rows[0]);

		const stream = writeHead(name, res);

		const doc = createDocument(Object.keys(columns).length);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		const title = `Reporte de ${name.toLowerCase()}`;
		const criterio = `Criterio ${obtenerDescripcionReporte(customWhere)}`;

		await setupLetterhead(doc, user.usuario, title, criterio);

		const detailHeaders = Object.entries(columns).map(([key, label]) => {
			return {
				key,
				label,
				align: getCellsAlign(key),
			};
		});

		doc.addTable(detailHeaders, rows, {
			fontSize: 12,
			width: 'fill_body',
		});

		if (body.sumatoria && Object.keys(body.sumatoria).length > 0) {
			console.log('**************');
			console.log({ sumatoria: body.sumatoria });
			console.log('**************');
			const { cabecera, objetoSuma } = calcSumatoria(
				columns,
				body.sumatoria,
				rows
			);
			doc.addTable(cabecera, [objetoSuma], {
				fontSize: 12,
				border: {
					size: 0,
					color: '#fff',
				},
				width: 'fill_body',
				headBackground: '#ffffff',
				headColor: '#ffffff',
				cellsFont: 'Helvetica-Bold',
			});
		}

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

export const reporteVentasPorHabitacion = async ({ body, user }, res) => {
	try {
		const { name, sort } = body;

		const servicios = await getQueryMethod({
			table: 'servicio',
			columns: { nombre: 'Nombre', codigo: 'Código' },
		});

		const [strWhere, valWhere] = getCustomWhere(sort);

		const columns = { habitacion: 'HAB.' };

		servicios.rows.forEach((s) => {
			columns[`s${s.codigo}`] = `${s.nombre.slice(0, 4)}`.toUpperCase();
		});
		columns['ventas'] = 'SUBTOTAL';
		columns['cobros'] = 'COBRO';
		columns['saldos'] = 'SALDO';

		const rows = await getFromQuery({
			sql: `SELECT 
	h.nombre AS habitacion, 
	${servicios.rows
		.map(
			(srv) =>
				`'Q.' || to_char(SUM(s${srv.codigo}), '999G999D99') AS s${srv.codigo}`
		)
		.join(', ')}, 
    'Q.' || to_char(SUM(ventas), '999G999D99') AS ventas , 
    'Q.' || to_char(MAX(cobros), '999G999D99') AS cobros , 
    'Q.' || to_char(SUM(ventas) - SUM(cobros), '999G999D99') AS saldos 
FROM (
	SELECT
		dt.habitacion , 
		${servicios.rows.map((srv) => `0 AS s${srv.codigo}`).join(', ')} ,
		sum(dr.monto) as cobros , 
		0 AS ventas 
	FROM detalle_recibo dr 
	LEFT JOIN tipo_pago tp 
		ON dr.tipo_pago = tp.codigo
	INNER JOIN detalle_transaccion dt 
		ON dr.serie_fac = dt.serie
		AND dr.ti_tran_fac = dt.tipo_transaccion
		AND dr.documento_fac = dt.documento
	WHERE dr.fecha::Date >= $1
		AND dr.fecha::Date <= $2
		AND dt.servicio = 1 
	GROUP BY dt.habitacion
	UNION
    SELECT 
        dt.habitacion , 
		${servicios.rows
			.map(
				(srv) =>
					`SUM(case when dt.servicio = ${srv.codigo} then dt.subtotal else 0 end) AS s${srv.codigo}`
			)
			.join(', ')} ,
		0 AS cobros , 
        SUM(dt.subtotal) AS ventas 
	FROM detalle_transaccion dt 
	INNER JOIN encabezado_transaccion et 
		ON dt.serie = et.serie 
		AND dt.tipo_transaccion = et.tipo_transaccion 
		AND dt.documento = et.documento 
	WHERE et.fecha_ingreso::Date >= $1 
		AND et.fecha_ingreso::Date <= $2
	GROUP BY dt.habitacion
) cv
INNER JOIN habitacion h 
	ON cv.habitacion = h.codigo
GROUP BY h.nombre`,
			values: valWhere,
		});

		const emptyRow = getEmptyRow(columns);

		if (rows.length === 0) {
			rows.push(emptyRow);
		}

		const title = `Reporte de ${name}`;
		const criterio = `Criterio: ${getReportCriterio(sort)}`;

		const stream = writeHead(name, res);

		const doc = createDocument(servicios.count + 3);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		await setupLetterhead(doc, user.usuario, title, criterio);

		const headers = Object.entries(columns).map(([key, label]) => {
			return {
				key,
				label,
				align: getCellsAlign(key, rows.at(0)[key]),
			};
		});

		doc.addTable(headers, rows, {
			fontSize: 12,
			width: 'fill_body',
		});

		const sumsCols = Object.assign({}, columns);
		delete sumsCols['habitacion'];

		// mostrar sumatoria
		const { cabecera, objetoSuma } = calcSumatoria(columns, sumsCols, rows);

		doc.addTable(cabecera, [objetoSuma, emptyRow, emptyRow], {
			fontSize: 12,
			border: {
				size: 0,
				color: '#fff',
			},
			width: 'fill_body',
			headBackground: '#ffffff',
			headColor: '#ffffff',
			cellsFont: 'Helvetica-Bold',
		});

		doc.addTable(
			[
				{
					key: 'codigo',
					label: 'Servicio',
					align: 'right',
				},
				{
					key: 'nombre',
					label: 'Nombre',
					align: 'right',
				},
			],
			servicios.rows.map((s) => ({
				codigo: `${s.nombre.slice(0, 4)}`,
				nombre: s.nombre,
			})),
			{
				fontSize: 12,
				width: 'auto',
				headBackground: '#f2f2f2',
			}
		);

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

export const reporteUsabilidad = async ({ body, user }, res) => {
	try {
		const { name, sort } = body;
		const month = sort[0];

		const days = getDaysInMonth(month.valor);

		const columns = { habitacion: 'HAB.' };
		days.forEach((d) => (columns[`dia${d}`] = `D-${d}`));
		columns['porcentaje'] = '% USO';

		const rows = await getFromQuery({
			sql: `SELECT 
				habitacion, 
				${days.map((d) => `dia${d} as dia${d}`).join(', ')},
				(((${days.map((d) => `dia${d}`).join(' + ')}) * 100)::numeric / ${
				days[days.length - 1]
			})::numeric(5,2) as porcentaje
			FROM 
				(SELECT
					h.nombre as habitacion, 
					${days
						.map(
							(d) =>
								`SUM(CASE WHEN EXTRACT(DAY FROM et.fecha_ingreso) = ${d} THEN 1 ELSE 0 END) AS dia${d}`
						)
						.join(', ')}
				FROM encabezado_transaccion et 
				INNER JOIN detalle_transaccion dt
					ON et.serie = dt.serie
					AND et.tipo_transaccion = dt.tipo_transaccion
					AND et.documento = dt.documento
				INNER JOIN habitacion h
				    ON dt.habitacion = h.codigo
				WHERE et.tipo_transaccion = 'CI' 
					AND dt.servicio = 1 
					AND et.fecha_ingreso > $1
					AND et.fecha_ingreso < $2
				GROUP BY h.nombre) s 
			GROUP BY habitacion, ${days.map((d) => `dia${d}`).join(', ')}`,
			values: [
				`${month.valor}-${days[0]}`,
				`${month.valor}-${days[days.length - 1]}`,
			],
		});

		const emptyRow = getEmptyRow(columns);

		if (rows.length === 0) {
			rows.push(emptyRow);
		}

		const title = `Reporte de ${name}`;
		const criterio = `Criterio: ${getReportCriterio(sort)}`;

		const stream = writeHead(name, res);

		const doc = createDocument(15);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		await setupLetterhead(doc, user.usuario, title, criterio);

		const headers = Object.entries(columns).map(([key, label]) => {
			return {
				key,
				label,
				align: 'right',
			};
		});

		console.log({ headers, rows });

		doc.addTable(headers, rows, {
			fontSize: 12,
			width: 'fill_body',
		});

		//mostrar sumatoria
		// const { cabecera, objetoSuma } = calcSumatoria(columns, {}, rows);

		// doc.addTable(cabecera, [objetoSuma], {
		// 	fontSize: 12,
		// 	border: {
		// 		size: 0,
		// 		color: '#fff',
		// 	},
		// 	width: 'fill_body',
		// 	headBackground: '#f2f2f2',
		// 	headColor: '#f2f2f2',
		// 	headHeight: 0.5,
		// 	cellsFont: 'Helvetica-Bold',
		// });

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

export const reporteVentas = async ({ body, user }, res) => {
	try {
		const { name, sort } = body;
		const month = sort[0];

		const days = getDaysInMonth(month.valor);

		const servicios = await getQueryMethod({
			table: 'servicio',
			columns: { nombre: 'Nombre', codigo: 'Código' },
		});

		const columns = { dia: 'DIA' };

		servicios.rows.forEach((s) => {
			columns[`s${s.codigo}`] = `${s.nombre.slice(0, 4)}`.toUpperCase();
		});
		columns['subtotal'] = 'SUBTOTAL';
		columns['cobro'] = 'COBRO';
		columns['saldo'] = 'SALDO';

		const rows = await getFromQuery({
			sql: `SELECT
    dia, 
	${servicios.rows
		.map(
			(s) =>
				`'Q.' || to_char(SUM(s${s.codigo}), '999G999D99') AS s${s.codigo}`
		)
		.join(', ')}, 
    'Q.' || to_char(SUM(subtotal), '999G999D99') AS subtotal, 
    'Q.' || to_char(SUM(subtotal) - MAX(saldo), '999G999D99') AS cobro, 
    'Q.' || to_char(MAX(saldo), '999G999D99') AS saldo 
FROM
	( SELECT
		EXTRACT(day FROM et.fecha_ingreso) AS dia,
		et,fecha_ingreso,
		et.fecha_salida,
		${servicios.rows
			.map(
				(s) =>
					`case when dt.servicio = '${s.codigo}' then dt.subtotal else 0 end AS s${s.codigo}`
			)
			.join(', ')},
		dt.subtotal, 
		0 AS cobro, 
		et.saldo 
	FROM detalle_transaccion dt
	INNER JOIN encabezado_transaccion et
		ON dt.serie = et.serie
		AND dt.tipo_transaccion = et.tipo_transaccion
		AND dt.documento = et.documento
	WHERE et.fecha_ingreso > $1
	AND et.fecha_ingreso < $2 
    and et.tipo_transaccion = 'CI'
	) d
GROUP BY dia
ORDER BY dia`,
			values: [
				`${month.valor}-${days[0]}`,
				`${month.valor}-${days[days.length - 1]}`,
			],
		});

		// CREATE EMPTY OBJECT WITH SAME KEYS AS cabecera
		const emptyRow = getEmptyRow(columns);

		if (rows.length === 0) {
			// mostrar columnas vacias
			rows.push(emptyRow);
		}

		const title = `Reporte de ${name}`;
		const criterio = `Criterio: ${getReportCriterio(sort)}`;

		const stream = writeHead(name, res);

		const doc = createDocument(servicios.count + 3);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		await setupLetterhead(doc, user.usuario, title, criterio);

		const headers = Object.entries(columns).map(([key, label]) => {
			return {
				key,
				label,
				align: getCellsAlign(key, rows.at(0)[key]),
			};
		});

		doc.addTable(headers, rows, {
			fontSize: 12,
			width: 'fill_body',
		});

		const sumsCols = Object.assign({}, columns);
		delete sumsCols['dia'];

		// mostrar sumatoria
		const { cabecera, objetoSuma } = calcSumatoria(columns, sumsCols, rows);

		const totalRow = [objetoSuma, emptyRow, emptyRow];

		doc.addTable(cabecera, totalRow, {
			fontSize: 12,
			border: {
				size: 0,
				color: '#fff',
			},
			width: 'fill_body',
			headBackground: '#ffffff',
			headColor: '#ffffff',
			cellsFont: 'Helvetica-Bold',
		});

		doc.moveDown();
		doc.moveDown();
		doc.moveDown();

		doc.addTable(
			[
				{ key: 'codigo', label: 'Servicio', align: 'right' },
				{ key: 'nombre', label: 'Nombre', align: 'right' },
			],
			servicios.rows.map((s) => ({
				codigo: `${s.nombre.slice(0, 4)}`,
				nombre: s.nombre,
			})),
			{
				fontSize: 12,
				width: 'auto',
				headBackground: '#f2f2f2',
			}
		);

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

export const reporteVentasYCobros = async ({ body, user }, res) => {
	try {
		const { name, sort } = body;

		const tiposPagos = await getQueryMethod({
			table: 'tipo_pago',
			columns: { nombre: 'Nombre', codigo: 'Código' },
		});

		const [strWhere, valWhere] = getCustomWhere(sort);

		const columns = {};

		columns['dia'] = 'DIA';
		columns['ventas'] = 'VENTAS';
		tiposPagos.rows.map((tp) => {
			columns[tp.nombre.slice(0, 3).toLowerCase()] =
				tp.nombre.toUpperCase();
		});
		columns['cobro'] = 'COBROS';
		columns['saldo'] = 'SALDO';
		columns['compras'] = 'COMPRAS';

		const rows = await getFromQuery({
			sql: `SELECT 
	EXTRACT(day FROM fecha) AS dia , 
	${tiposPagos.rows
		.map(
			(tp) =>
				`'Q' || to_char(sum(${tp.nombre.slice(
					0,
					3
				)}), '999G999D99') AS ${tp.nombre.slice(0, 3)}`
		)
		.join(' , ')},
	'Q' || to_char(sum(cobro), '999G999D99') AS cobro , 
	'Q' || to_char(sum(ventas), '999G999D99') AS ventas , 
	'Q' || to_char(sum(compras), '999G999D99') AS compras , 
	'Q' || to_char(sum(ventas) - sum(cobro), '999G999D99') AS saldo 
FROM (
	SELECT 
		fecha , 
		${tiposPagos.rows
			.map((tp) => `${tp.nombre.slice(0, 3)} AS ${tp.nombre.slice(0, 3)}`)
			.join(' , ')} , 
		(${tiposPagos.rows
			.map((tp) => `${tp.nombre.slice(0, 3)}`)
			.join(' + ')}) AS cobro , 
		0 AS ventas , 
		0 AS compras 
	FROM (
		SELECT 
			dr.fecha::Date , 
			${tiposPagos.rows
				.map(
					(tp) =>
						`sum(CASE WHEN dr.tipo_pago = ${
							tp.codigo
						} THEN dr.monto ELSE 0 END) AS ${tp.nombre.slice(0, 3)}`
				)
				.join(' , ')} , 
			0 AS ventas 
		FROM detalle_recibo dr 
		LEFT JOIN tipo_pago tp 
			ON dr.tipo_pago = tp.codigo 
		WHERE dr.fecha::Date >= $1 
		AND dr.fecha::Date <= $2 
		GROUP BY dr.fecha::Date 
	) p 
	UNION 
	SELECT 
		et.fecha_ingreso::Date , 
		${tiposPagos.rows.map((tp) => `0 AS ${tp.nombre.slice(0, 3)}`).join(' , ')} , 
		0 AS cobro , 
		sum(dt.subtotal) AS ventas , 
		0 AS compras 
	FROM detalle_transaccion dt 
    LEFT JOIN encabezado_transaccion et
    	on dt.serie = et.serie 
    	and dt.tipo_transaccion = et.tipo_transaccion 
    	and dt.documento = et.documento 
	WHERE et.fecha_ingreso::Date >= $1 
	AND et.fecha_ingreso::Date <= $2 
	AND et.tipo_transaccion = 'CI' 
	GROUP BY et.fecha_ingreso::Date 
	UNION 
	SELECT 
		pt.fecha::Date , 
		${tiposPagos.rows.map((tp) => `0 AS ${tp.nombre.slice(0, 3)}`).join(' , ')} , 
		0 AS cobro , 
		0 AS ventas , 
		pt.total AS compras 
	FROM pp_tranenc pt 
	WHERE pt.fecha::Date >= $1 
	AND pt.fecha::Date <= $2
) cv 
group by fecha`,
			values: valWhere,
		});

		const emptyRow = getEmptyRow(columns);

		if (rows.length === 0) {
			rows.push(emptyRow);
		}

		const title = `Reporte de cobros y ventas`;
		const criterio = `Criterio: ${getReportCriterio(sort)}`;

		const stream = writeHead(name, res);

		const doc = createDocument(tiposPagos.count + 3);

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		await setupLetterhead(doc, user.usuario, title, criterio);

		const headers = Object.entries(columns).map(([key, label]) => {
			return {
				key,
				label,
				align: 'right',
			};
		});

		console.log({ headers, rows });

		doc.addTable(headers, rows, {
			fontSize: 12,
			width: 'fill_body',
		});

		const objToGetSum = Object.assign({}, columns);
		delete objToGetSum['dia'];

		const { cabecera, objetoSuma } = calcSumatoria(
			columns,
			objToGetSum,
			rows
		);

		const totalRow = [objetoSuma, emptyRow, emptyRow];

		console.log({ cabecera, totalRow });

		doc.addTable(cabecera, totalRow, {
			fontSize: 12,
			border: {
				size: 0,
				color: '#fff',
			},
			width: 'fill_body',
			headBackground: '#ffffff',
			headColor: '#ffffff',
			cellsFont: 'Helvetica-Bold',
		});

		doc.render();

		setupPagesNumber(doc);

		doc.flushPages();

		doc.end();
	} catch (error) {
		errorHandler(res, error);
	}
};

export const reportesGerenciales = async ({ body, query }, res) => {
	try {
		const month = query.fecha.split('-')[1];

		const barras = await getFromQuery({
			sql: `select
				s.nombre ,
				count(dt.servicio) vendidos
			from detalle_transaccion dt
			full join servicio s 
				on dt.servicio = s.codigo
			group by s.codigo , s.nombre 
			order by vendidos desc ;
			`,
		});
		const lineas = await getFromQuery({
			sql: `select s.fecha, s.conteo
			from (
				select
					extract(day from et.fecha_ingreso::Date) fecha,
					count(*) conteo
				from encabezado_transaccion et 
				join detalle_transaccion dt 
					on et.serie = dt.serie 
					and et.tipo_transaccion = dt.tipo_transaccion 
					and et.documento = dt.documento 
				where dt.servicio = 1
				and et.tipo_transaccion = 'CI'
				group by et.fecha_ingreso::Date
				union all select 01, 0
				union all select 03, 0
				union all select 04, 0
				union all select 05, 0
			) s 
			order by s.conteo desc ;
		`,
		});
		const pastel = await getFromQuery({
			sql: `
			select
				s.nombre , sum(dt.subtotal) conteo
			from detalle_transaccion dt 
			inner join servicio s 
				on dt.servicio = s.codigo 
			group by s.nombre ;
		`,
		});

		return res.status(200).json({ barras, lineas, pastel });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const habPorDia = async ({ body, query }, res) => {
	try {
		const month = query.fecha;

		const sql = `select 
	extract(day from fm.fecha) as dia , 
	sum (
		case 
			when extract(day from et.fecha_ingreso) <= extract(day from fm.fecha) 
			and extract(day from et.fecha_salida) >= extract(day from fm.fecha) 
			then 1 
			else 0 end
	) as ocupada
from (
	select 
		fecha::date 
	from 
		generate_series('${month}-01', '${month}-31', '1 day'::interval) fecha
) as fm 
left join encabezado_transaccion et 
	on et.fecha_ingreso <= fm.fecha 
	and et.fecha_salida >= fm.fecha 
group by fm.fecha 
order by fm.fecha `;
		const result = await getFromQuery({
			sql,
			values: [],
		});
		return res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const checkinPorTipoHab = async ({ body, query }, res) => {
	try {
		const month = query.fecha;

		const sql = `select u.nombre, sum(u.uso) uso
from (
	select th.nombre , 0 uso 
	from tipo_habitacion th
	union 
	select 
		th.nombre , 
		count(*) uso
	from encabezado_transaccion et 
	inner join detalle_transaccion dt 
		on et.serie = dt.serie 
		and et.tipo_transaccion = dt.tipo_transaccion 
		and et.documento = dt.documento 
	inner join habitacion h 
		on dt.habitacion = h.codigo 
	inner join tipo_habitacion th 
		on h.tipo = th.codigo 
	where 
		et.fecha_ingreso >= '${month}-01'::date 
		and et.fecha_ingreso <= '${month}-31'::date 
		and et.tipo_transaccion = 'CI' 
		and dt.servicio = 1 
	group by th.nombre
) u 
group by u.nombre `;

		const results = await getFromQuery({
			sql,
			values: [],
		});
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const ingresos = async ({ body, query }, res) => {
	try {
		const month = query.fecha;

		const sql = `select 
	extract(day from fm.fecha) as dia , 
	sum(case
		when et.total >= 0 then et.total else 0
	end) as ingresos 
from (
	select 
		fecha::date 
	from 
		generate_series('${month}-01', '${month}-31', '1 day'::interval) fecha
) as fm 
left join encabezado_transaccion et 
	on et.fecha_ingreso::date = fm.fecha 
group by fm.fecha 
order by fm.fecha `;
		const results = await getFromQuery({
			sql,
			values: [],
		});
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const avg_estance = async ({ body, query }, res) => {
	try {
		const month = query.fecha;

		const sql = `select 
	extract(day from fecha) as dia , 
	sum(promedio)::numeric(5,2) as promedio 
from (
	select 
		fecha::date , 
		0 as promedio
	from 
		generate_series('${month}-01', '${month}-31', '1 day'::interval) fecha
	union 
	select 
		fecha , 
		avg(duracion) as promedio
	from (
		select 
			et.fecha_ingreso ::date as fecha , 
			(extract(day from et.fecha_salida) - extract(day from et.fecha_ingreso)) as duracion
		from encabezado_transaccion et 
		where et.fecha_ingreso >= '${month}-01' 
		and et.fecha_ingreso <= '${month}-31'
	) as epd
	group by fecha 
	order by fecha 
) q 
group by dia 
order by dia asc `;
		const results = await getFromQuery({
			sql,
			values: [],
		});
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const salesPerVendedor = async ({ body, query }, res) => {
	try {
		const month = query.fecha;

		const sql = `select 
	nombre , 
	sum(ventas) as ventas 
from (
	select 
		v.nombre , 
		0 as ventas 
	from vendedor v 
	union 
	select 
		nombre , 
		count(nombre) as ventas 
	from (
		select 
			v.nombre 
		from encabezado_transaccion et 
		left join vendedor v 
			on et.vendedor = v.codigo 
		where et.fecha_ingreso >= '${month}-01' 
		and et.fecha_ingreso <= '${month}-31'
	) vpv 
	group by nombre 
) vts
group by nombre 
order by ventas desc `;
		const results = await getFromQuery({
			sql,
			values: [],
		});
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
