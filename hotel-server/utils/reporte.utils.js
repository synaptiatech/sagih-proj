import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit-construct';
import { getOneQueryMethod } from '../db/querys.js';
import { formatDate, formatTime } from './formatos.js';
import { __dirname } from './log.utils.js';

/**
 * Crear el documento PDF
 * @param {number} colsNumber Columnas del reporte
 * @returns {PDFDocument} Documento PDF
 */
export const createDocument = (colsNumber = 4) => {
	const doc = new PDFDocument({
		size: colsNumber > 9 ? 'legal' : 'letter',
		layout: colsNumber > 7 ? 'landscape' : 'portrait',
		margins: { top: 50, bottom: 10, left: 50, right: 50 },
		bufferPages: true,
	});

	return doc;
};

/**
 * Agregar los headers
 * @param {string} name Nombre del reporte
 * @param {import('express').Response} res Response
 */
export const writeHead = (name, res) => {
	const filename = `${name}_${new Date().toLocaleDateString('es-GT')}.pdf`;

	return res.writeHead(200, {
		'Content-Type': 'application/pdf',
		'Content-Disposition': `attachment; filename="${filename}"`,
	});
};

/**
 * Agregar el membrete
 * @param {PDFDocument} doc Documento actual
 * @param {string} user Usuario que genera el reporte
 * @param {string} title Título del reporte
 * @param {Object|string} criterio Criterio de búsqueda
 */
export const setupLetterhead = async (
	doc,
	user = 'Usuario',
	title = 'Reporte',
	criterio = ''
) => {
	const empresa = await getOneQueryMethod({
		table: 'empresa',
	});

	const logo =
		empresa?.logo && String(empresa.logo).trim() !== ''
			? String(empresa.logo).trim()
			: 'logo_hotel.jpeg';

	const imagePath = path.join(__dirname, '/../archivos/', logo);

	console.log('Ruta del logo:', imagePath);

	doc.setDocumentHeader({ height: '15%' }, () => {
		doc.fontSize(14)
			.font('Helvetica-Bold')
			.text(empresa ? empresa.nombre : 'Empresa', 70, 50, {
				align: 'center',
			});

		doc.fontSize(10)
			.font('Helvetica')
			.text(empresa ? empresa.direccion : 'Dirección', 70, 66, {
				align: 'center',
			});

		doc.fontSize(10)
			.font('Helvetica')
			.text(empresa ? empresa.nit : 'Nit', 70, 78, {
				align: 'center',
			});

		doc.fontSize(10)
			.font('Helvetica')
			.text(formatDate(), 70, 62, {
				align: 'right',
			});

		doc.fontSize(10)
			.font('Helvetica')
			.text(formatTime(), 70, 74, {
				align: 'right',
			});

		doc.fontSize(10)
			.font('Helvetica')
			.text(user ?? 'Usuario', 70, 86, {
				align: 'right',
			});

		if (fs.existsSync(imagePath)) {
			doc.image(imagePath, 50, 40, {
				fit: [75, 75],
				align: 'left',
			});
		} else {
			console.error('No se encontró el logo en:', imagePath);
		}

		doc.font('Helvetica-Bold')
			.fontSize(14)
			.text(title, 50, 114, {
				align: 'left',
			});

		doc.font('Helvetica')
			.fontSize(10)
			.text(criterio || '', 50, 130, {
				align: 'left',
			});
	});
};

/**
 * @param {Object} columns Objeto con las columnas
 */
export const getEmptyRow = (columns) => {
	const row = {};
	Object.keys(columns).forEach((col) => {
		row[col] = '';
	});
	return row;
};

/**
 * @param {Object[]} columns Arreglo de columnas
 */
export const getEmptyRowFromArray = (columns) => {
	const row = {};
	columns.forEach((col) => {
		row[col.key] = '';
	});
	return row;
};

/**
 * Convertir valores monetarios/texto a número sin perder decimales
 * @param {string|number|null|undefined} value
 * @returns {number}
 */
const parseMoneyValue = (value) => {
	if (value === null || value === undefined || value === '') {
		return 0;
	}

	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : 0;
	}

	const cleaned = String(value)
		.replace(/GTQ/gi, '')
		.replace('Q.', '')
		.replace('Q', '')
		.replace(/,/g, '')
		.replace(/\s/g, '')
		.trim();

	const parsed = Number(cleaned);
	return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Configurar la numeración de páginas
 * @param {PDFDocument} doc Documento actual
 */
export const calcSumatoria = (columns, sumatoria, rows) => {
	const objetoSuma = {};

	Object.keys(columns).forEach((key) => {
		if (key in sumatoria) {
			const total = rows.reduce((prev, curr) => {
				return prev + parseMoneyValue(curr?.[key]);
			}, 0);

			objetoSuma[key] = new Intl.NumberFormat('es-GT', {
				style: 'currency',
				currency: 'GTQ',
			}).format(total);
		} else {
			objetoSuma[key] = '    ';
		}
	});

	const cabecera = Object.entries(columns).map(([key, label]) => {
		return {
			key,
			label,
			align: 'right',
		};
	});

	console.log({ cabecera, objetoSuma });
	return { cabecera, objetoSuma };
};

export const setupPagesNumber = (doc) => {
	let curPage;
	let endPage;

	const { start, count } = doc.bufferedPageRange();

	for (
		curPage = start, endPage = start + count, start <= endPage;
		curPage < endPage;
		curPage++
	) {
		doc.switchToPage(curPage);
		doc.fontSize(10)
			.font('Helvetica')
			.text(`${curPage + 1} / ${count}`, 450, 50, {
				align: 'right',
			});
	}
};

/**
 * Obtener alineación de las celdas
 * @param {string} key Nombre de la columna en la base de datos
 * @param {string} value Valor de la celda
 */
export const getCellsAlign = (key, value = '') => {
	if (
		key.includes('subtotal') ||
		key.includes('total') ||
		key.includes('saldo') ||
		key.includes('precio') ||
		key.includes('cantidad') ||
		key.includes('monto') ||
		key.includes('codigo') ||
		key.includes('documento') ||
		key.includes('porcentaje') ||
		key.includes('compras') ||
		key.includes('ventas') ||
		key.includes('cobros') ||
		key.includes('pagos') ||
		key.includes('ingresos') ||
		key.includes('egresos') ||
		key.includes('utilidad') ||
		key.includes('habitacion') ||
		key.includes('h_nombre') ||
		key.includes('numero_personas') ||
		key.includes('abono')
	) {
		return 'right';
	}

	if (typeof value === 'string' && value.includes('Q.')) {
		return 'right';
	}

	return 'left';
};

const getOperatorByRelation = (relation) => {
	switch (relation) {
		case 'del':
			return '>';
		case 'al':
			return '<';
		case 'es':
			return '=';
		case 'noes':
			return '<>';
		case 'contiene':
			return 'ILIKE';
		case 'nocontiene':
			return 'NOT ILIKE';
		default:
			return relation;
	}
};

/**
 * Normalizar valores de fecha para SQL
 * @param {any} value
 * @returns {any}
 */
const normalizeDateValue = (value) => {
	if (value === null || value === undefined || value === '') {
		return value;
	}

	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}

	if (typeof value !== 'string') {
		return value;
	}

	const trimmed = value.trim();

	// YYYY-MM-DD o YYYY-MM-DD HH:mm:ss
	const isoMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
	if (isoMatch) {
		return isoMatch[1];
	}

	// DD/MM/YYYY
	const latamMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (latamMatch) {
		const [, dd, mm, yyyy] = latamMatch;
		return `${yyyy}-${mm}-${dd}`;
	}

	return trimmed;
};

/**
 * Obtener el where de la consulta
 * @param {Object[]} where Criterio de búsqueda
 * @returns {[string, any[]]} Where de la consulta
 */
export const getCustomWhere = (where) => {
	const values = [];
	let paramIndex = 1;

	const str = where
		.map((w) => {
			if (!w?.columna || w?.valor === undefined || w?.valor === null || w?.valor === '') {
				return null;
			}

			let valueToPush = w.valor;

			if (w.columna.includes('fecha')) {
				valueToPush = normalizeDateValue(w.valor);
			}

			values.push(valueToPush);

			return `${w.columna} ${getOperatorByRelation(w.relacion)} $${paramIndex++}`;
		})
		.filter(Boolean)
		.join(' AND ');

	return [str, values];
};

/**
 * Obtener los días de un mes
 * @param {string} date Fecha en formato 'YYYY-MM'
 * @returns {number[]} Días del mes
 */
export const getDaysInMonth = (date) => {
	const [year, month] = date.split('-');
	const days = new Date(year, month, 0).getDate();
	return Array.from(Array(days), (_, i) => i + 1);
};

/**
 * Obtener el criterio de búsqueda
 * @param {Object[]} where Arreglo de criterios de búsqueda
 * @returns {string} Criterio de búsqueda
 */
export const getReportCriterio = (where) => {
	return where.map((w) => `${w.nombre} ${w.relacion} ${w.valor}`).join(', ');
};
