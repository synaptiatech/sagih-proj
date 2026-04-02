import { pool } from '../config/db.js';
import { functionName, tablesName, viewsName } from '../consts/names.js';
import {
	bulkInsertQuery,
	deleteQuery,
	getFromQuery,
	getOneQueryMethod,
	getQueryMethod,
	getWithFilter,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import {
	formatearFecha,
	getGuatemalaTimestamp,
} from '../utils/formatos.js';

export const getCorrelativoFiltered = async (req, res) => {
	try {
		console.log('getCorrelativoFiltered', req.query);
		const results = await getWithFilter(tablesName.CORRELATIVO, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getCorrelativo = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.CORRELATIVO,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllCorrelativo = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createCorrelativo = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.CORRELATIVO, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateCorrelativo = async (req, res) => {
	try {
		const results = await updateQuery(
			tablesName.CORRELATIVO,
			req.body,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteCorrelativo = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.CORRELATIVO, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getTransaccion = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: viewsName.VIEW_TRAN,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllTransaccion = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
 * Obtener siguiente estado de la habitación según la operación a realizar
 * @param {string} operacion Operacion a realizar en transacción
 * @returns {string} Estado de la habitación
 */
const sigEstadoHab = (operacion) => {
	console.log(operacion);
	switch (operacion) {
		case 'CI':
			console.log('O');
			return 'O';
		case 'CO':
			console.log('L');
			return 'L';
		case 'RE':
			console.log('D');
			return 'D';
		default:
			console.log('D');
			return 'D';
	}
};

/**
 * Completar información del encabezado de la transacción
 * @param {Object} correlativo Correlativo de la transacción
 * @param {Object} tranEnc Transacción
 * @returns Transacción completa
 */
const completarTranEnc = ({ serie, tipo_transaccion, siguiente }, tranEnc) => {
	return {
		serie: serie,
		tipo_transaccion: tipo_transaccion,
		documento: siguiente,
		fecha: getGuatemalaTimestamp(),
		fecha_ingreso: formatearFecha(
			tranEnc.fecha_ingreso,
			tranEnc.hora_ingreso
		),
		fecha_salida: formatearFecha(tranEnc.fecha_salida, tranEnc.hora_salida),
		numero_personas: tranEnc.numero_personas,
		nombre_factura: tranEnc.nombre_factura || '',
		nit_factura: tranEnc.nit_factura || '',
		direccion_factura: tranEnc.direccion_factura || '',
		cliente: tranEnc.cliente || 0,
		vendedor: tranEnc.vendedor || 0,
	};
};

/**
 * Completar los detalles de la transacción
 * @param {Object} correlativo Correlativo de la transacción
 * @param {Object} habitacion Habitación
 * @param {Object[]} detalle Arreglo con los detalles de la transacción
 * @returns Detalles de la transacción completas
 */
const completarTranDet = (
	{ serie, tipo_transaccion, siguiente },
	{ codigo },
	detalle
) => {
	const fecha = getGuatemalaTimestamp();

	return detalle.map((d) => {
		return {
			codigo: d.codigo > 0 ? d.codigo : 0,
			serie: serie,
			tipo_transaccion: tipo_transaccion,
			documento: siguiente,
			descripcion: d.descripcion || 'null',
			habitacion: codigo || null,
			servicio: d.servicio || null,
			precio: parseFloat(`${d.precio}`.replace('Q. ', '')) || 0,
			cantidad: d.cantidad || 1,
			subtotal: parseFloat(`${d.subtotal}`.replace('Q. ', '')) || 0,
			fecha,
		};
	});
};

/**
 * Generar objeto con los datos del encabezado de recibo
 * @param {Object} tranEnc Objeto con los datos del encabezado de transacción
 * @param {Object[]} rcDet Arreglo con los datos del detalle de recibo
 * @returns {Object} Objeto con los datos del encabezado de recibo
 */
export const completarRcEnc = (rcDet, { cliente, vendedor }) => {
	const fecha = getGuatemalaTimestamp();

	const rcEncWDuplicated = rcDet.map((detalle) => {
		return {
			serie: detalle.serie,
			tipo_transaccion: detalle.tipo_transaccion,
			documento: Number(detalle.documento),
			cliente: cliente,
			cobrador: vendedor,
			fecha,
			abono: 0,
		};
	});
	const setEncabezado = new Set();
	const rcEnc = rcEncWDuplicated.filter((detalle) => {
		const key = `${detalle.serie}-${detalle.tipo_transaccion}-${detalle.documento}`;
		if (setEncabezado.has(key)) return false;
		setEncabezado.add(key);
		return true;
	});
	return rcEnc;
};

/**
 * Completar los datos de los detalles de recibo
 * @param {Object[]} rcDet Arreglo con los datos de los recibos
 * @returns {Object[]} Arreglo con los datos del detalle de recibo
 */
export const completarRcDet = (
	rcDet,
	{ serie, tipo_transaccion, siguiente, documento }
) => {
	const fecha = getGuatemalaTimestamp();

	return rcDet.map((r) => {
		return {
			codigo: r.codigo,
			serie: r.serie,
			tipo_transaccion: r.tipo_transaccion,
			documento: Number(r.documento),
			serie_fac: serie,
			ti_tran_fac: tipo_transaccion,
			documento_fac: siguiente || documento,
			fecha,
			descripcion: r.descripcion,
			tipo_pago: r.tipo_pago,
			monto: r.monto,
		};
	});
};

export const closeTransaccion = async ({ body }, res) => {
	try {
		const {
			habitacion,
			tranCorrelativo,
			tranEncabezado,
			tranDetalle,
			rcDetalle,
			operacion,
		} = body;
		let tranDet = completarTranDet(
			{
				serie: tranCorrelativo.serie,
				tipo_transaccion: tranCorrelativo.tipo_transaccion,
				siguiente: tranCorrelativo.documento,
			},
			habitacion,
			tranDetalle
		);

		await updateQuery(
			tablesName.TRAN_ENC,
			{ estado: 1 },
			{
				serie: tranCorrelativo.serie,
				tipo_transaccion: tranCorrelativo.tipo_transaccion,
				documento: tranCorrelativo.documento,
			}
		);

		await bulkInsertQuery(
			tablesName.TRAN_DETALLE,
			tranDet.filter((d) => d.codigo === undefined || d.codigo === null)
		);
		await updateQuery(
			tablesName.HABITACION,
			{ estado: sigEstadoHab(operacion) },
			{ codigo: habitacion.codigo }
		);

		let encRc = {};
		let detRc = {};
		if (rcDetalle.length > 0) {
			detRc = completarRcDet(
				rcDetalle.filter(
					(d) => d.codigo === undefined || d.codigo === null
				),
				tranCorrelativo
			);
			encRc = completarRcEnc(detRc, tranEncabezado);
			await bulkInsertQuery(tablesName.RC_ENC, encRc);
			await bulkInsertQuery(tablesName.RC_DETALLE, detRc);
		}
		res.status(200).json({ message: 'Check in completado exitosamente' });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createTransaccion = async ({ body }, res) => {
	const {
		habitacion,
		tranCorrelativo,
		tranEncabezado,
		tranDetalle,
		rcDetalle,
		operacion,
	} = body;

	try {
		const { serie, tipo_transaccion, documento } = tranEncabezado;
		let tranEnc = completarTranEnc(tranCorrelativo, tranEncabezado);
		let tranDet = completarTranDet(
			tranCorrelativo,
			habitacion,
			tranDetalle
		);
		if (tranEnc.vendedor === 0) delete tranEnc.vendedor;

		console.log({ tranEnc, tranDet });

		console.log('---- TRAN ENC ----');
		await insertQuery(tablesName.TRAN_ENC, tranEnc);
		console.log('---- TRAN DET ----');
		await bulkInsertQuery(tablesName.TRAN_DETALLE, tranDet);

		console.log('Datos antiguos ->', tipo_transaccion);

		if (rcDetalle.length > 0) {
			const rcDet = completarRcDet(rcDetalle, tranCorrelativo).filter(
				(r) => r.codigo === undefined || r.codigo === 0
			);
			const rcEnc = completarRcEnc(rcDet, tranEnc);

			console.log('------ RC ENC ------');
			await bulkInsertQuery(tablesName.RC_ENC, rcEnc);
			console.log('------ RC DET ------');
			await bulkInsertQuery(tablesName.RC_DETALLE, rcDet);

			if (tipo_transaccion === 'RE') {
				console.log('----- RE POINT -----');
				console.log({ serie, tipo_transaccion, documento });
				console.log('---------------------');

				await updateQuery(
					tablesName.RC_DETALLE,
					{
						serie_fac: tranCorrelativo.serie,
						ti_tran_fac: tranCorrelativo.tipo_transaccion,
						documento_fac: tranCorrelativo.siguiente,
					},
					{
						serie_fac: serie,
						ti_tran_fac: tipo_transaccion,
						documento_fac: documento,
					}
				);
			}
		}

		await updateQuery(
			tablesName.HABITACION,
			{ estado: sigEstadoHab(operacion) },
			{ codigo: habitacion.codigo }
		);

		if (tipo_transaccion === 'RE') {
			console.log('----- COMPLETED -----');
			console.log({ serie, tipo_transaccion, documento });
			console.log('---------------------');

			await updateQuery(
				tablesName.TRAN_ENC,
				{ estado: 1 },
				{
					serie,
					tipo_transaccion,
					documento,
				}
			);
		}

		res.status(200).json({ message: 'Transacción creada' });
	} catch (error) {
		console.error(error);
		errorHandler(res, error);
	}
};

export const updateTransaccion = async ({ body }, res) => {
	try {
		const {
			habitacion,
			tranCorrelativo,
			tranEncabezado,
			tranDetalle,
			rcDetalle,
			operacion,
		} = body;

		const tranEnc = {
			fecha_salida: formatearFecha(
				tranEncabezado.fecha_salida,
				tranEncabezado.hora_salida
			),
			numero_personas: tranEncabezado.numero_personas,
			nombre_factura: tranEncabezado.nombre_factura,
			nit_factura: tranEncabezado.nit_factura,
			direccion_factura: tranEncabezado.direccion_factura,
			cliente: tranEncabezado.cliente,
			vendedor: tranEncabezado.vendedor,
		};
		const tranDet = completarTranDet(
			tranCorrelativo,
			habitacion,
			tranDetalle
		);

		console.log('---- TRAN ENC ----');
		console.log({ tranDet });

		const new_tranDet = tranDet.filter((detalle) => {
			return detalle.codigo === 0;
		});

		const hab_tranDet = tranDet.filter((detalle) => {
			return (detalle.servicio = 1);
		});

		await updateQuery(tablesName.TRAN_ENC, tranEnc, {
			serie: tranCorrelativo.serie,
			tipo_transaccion: tranCorrelativo.tipo_transaccion,
			documento: tranCorrelativo.documento || tranCorrelativo.siguiente,
		});

		await updateQuery(
			tablesName.TRAN_DETALLE,
			{
				habitacion: hab_tranDet[0].habitacion,
				subtotal: hab_tranDet[0].precio,
				cantidad: hab_tranDet[0].cantidad,
				precio: hab_tranDet[0].precio * hab_tranDet[0].cantidad,
			},
			{
				serie: tranCorrelativo.serie,
				tipo_transaccion: tranCorrelativo.tipo_transaccion,
				documento:
					tranCorrelativo.documento || tranCorrelativo.siguiente,
				codigo: hab_tranDet[0].codigo,
			}
		);

		if (new_tranDet.length > 0) {
			await bulkInsertQuery(tablesName.TRAN_DETALLE, new_tranDet);
		}

		let encRc = {};
		let detRc = {};

		if (rcDetalle.length > 0) {
			detRc = completarRcDet(rcDetalle, tranCorrelativo);
			const new_detRc = detRc.filter((detalle) => {
				return detalle.codigo === undefined;
			});
			encRc = completarRcEnc(new_detRc, tranEnc);

			await bulkInsertQuery(tablesName.RC_ENC, encRc);
			await bulkInsertQuery(tablesName.RC_DETALLE, new_detRc);
		}

		res.status(200).json(body);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteTransaccion = async (req, res) => {
	try {
		const result = await getQueryMethod({
			table: 'fn_transaccion',
			query: req.query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getDetalleTransaccion = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.TRAN_DETALLE,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllDetalleTransaccion = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createDetalleTransaccion = async ({ body }, res) => {
	try {
		console.log('insert detalles', body);

		const rows = Array.isArray(body)
			? body.map((item) => ({
					...item,
					fecha: item.fecha || getGuatemalaTimestamp(),
			  }))
			: [{ ...body, fecha: body.fecha || getGuatemalaTimestamp() }];

		await bulkInsertQuery(tablesName.TRAN_DETALLE, rows);
		res.status(200).json({ message: 'Detalle de transacción creado' });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateDetalleTransaccion = async ({ body, query }, res) => {
	try {
		const results = await updateQuery(tablesName.TRAN_DETALLE, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteDetalleTransaccion = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.TRAN_DETALLE, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getTransaccionByDocumento = async ({ query }, res) => {
	try {
		const { serie, tipo_transaccion, documento } = query;
		let dataHabitacion = {};

		const tranEncs = await getFromQuery({
			sql: `SELECT * 
			FROM encabezado_transaccion et 
			INNER JOIN detalle_transaccion dt 
			USING (serie, tipo_transaccion, documento)
			WHERE 
				serie = $1 and 
				tipo_transaccion = $2 and 
				documento = $3`,
			values: [serie, tipo_transaccion, documento],
		});

		if (tranEncs.length === 0) {
			throw new Error('No se encontró la transacción');
		}

		const tranDetalles = await getQueryMethod({
			table: tablesName.TRAN_DETALLE,
			query,
		});

		if (tranDetalles.count == 0 || tranDetalles.rows.length === 0) {
			throw new Error('No se encontró el detalle de la transacción');
		}

		dataHabitacion = await getOneQueryMethod({
			table: viewsName.VIEW_HABITACION,
			query: {
				codigo: tranDetalles.rows[0].habitacion,
			},
		});

		const rcDetalles = await getQueryMethod({
			table: tablesName.RC_DETALLE,
			query: {
				serie_fac: serie,
				ti_tran_fac: tipo_transaccion,
				documento_fac: documento,
			},
		});

		res.status(200).json({
			habitacion: dataHabitacion,
			tranCorrelativo: {
				serie,
				tipo_transaccion,
				documento,
				siguiente: documento,
			},
			tranEnc: tranEncs[0],
			tranDetalle: tranDetalles.rows,
			rcEnc: {},
			rcDetalle: rcDetalles.rows,
		});
	} catch (error) {
		console.error(error);
		errorHandler(res, error);
	}
};

export const getDataForReports = async ({ query, body }, res) => {
	try {
		const transacciones = await getQueryMethod({
			table: tablesName.TI_TRAN,
		});
		const clientes = await getQueryMethod({ table: tablesName.CLIENTE });
		const vendedores = await getQueryMethod({
			table: tablesName.VENDEDOR,
		});
		res.status(200).json({ transacciones, clientes, vendedores });
	} catch (error) {
		res.status(200).json({ message: error.message });
	}
};

export const getTransaccionByHabitacion = async ({ query, body }, res) => {
	try {
		const habitaciones = await getFromQuery({
			sql: `SELECT h.* , th.nombre as tipo_nombre
			FROM ${tablesName.HABITACION} h 
			INNER JOIN ${tablesName.TIPO_HABITACION} th 
			ON h.tipo = th.codigo
			WHERE h.codigo = $1`,
			values: [query.habitacion],
		});

		const listTranEnc = await getQueryMethod({
			table: functionName.FN_TRANENC_HAB,
			query,
		});

		if (listTranEnc.count === 0) {
			console.log('No hay transacciones...');
			return res.status(200).json({
				habitacion: habitaciones.at(0),
				tranEnc: {},
				tranDetalle: [],
				rcEnc: [],
				rcDetalle: [],
			});
		}

		const firstTranEnc = listTranEnc.rows.pop();

		const correlativo = {
			serie: firstTranEnc.serie,
			tipo_transaccion: firstTranEnc.tipo_transaccion,
			documento: firstTranEnc.documento,
		};

		const listTranDet = await getQueryMethod({
			table: tablesName.TRAN_DETALLE,
			query: correlativo,
		});

		const listRcDet = await getQueryMethod({
			table: tablesName.RC_DETALLE,
			query: {
				serie_fac: firstTranEnc.serie,
				ti_tran_fac: firstTranEnc.tipo_transaccion,
				documento_fac: firstTranEnc.documento,
			},
		});

		res.status(200).json({
			habitacion: habitaciones.at(0),
			tranCorrelativo: {
				serie: firstTranEnc.serie,
				tipo_transaccion: firstTranEnc.tipo_transaccion,
				documento: firstTranEnc.documento,
				siguiente: firstTranEnc.documento,
			},
			tranEnc: firstTranEnc,
			tranDetalle: listTranDet.rows,
			rcEnc: [],
			rcDetalle: listRcDet.rows,
		});
	} catch (error) {
		errorHandler(res, error);
	}
};
