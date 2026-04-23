import { tablesName } from '../consts/names.js';
import {
	bulkInsertQuery,
	deleteQuery,
	getFromQuery,
	getOne,
	getOneQueryMethod,
	getQueryMethod,
	getWithPaginate,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import { getGuatemalaTimestamp } from '../utils/formatos.js';
import { completarRcDet, completarRcEnc } from './transaccion.controller.js';

/* **************************************************************
 * Recibo
 * **************************************************************/
export const getRecibo = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.RC_ENC,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllRecibo = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getRecibosPorDocumento = async ({ query }, res) => {
	try {
		const { serie, tipo_transaccion, documento } = query;
		const results = await getFromQuery({
			sql: `
				SELECT
					dr.codigo,
					CONCAT(dr.tipo_transaccion, '-', dr.serie, '-', dr.documento) AS n_recibo,
					TO_CHAR(dr.fecha, 'DD/MM/YYYY HH24:MI:SS') AS fecha,
					tp.nombre AS tipo_pago,
					dr.descripcion,
					dr.monto
				FROM detalle_recibo dr
				INNER JOIN tipo_pago tp ON dr.tipo_pago = tp.codigo
				WHERE dr.serie_fac = $1
					AND dr.ti_tran_fac = $2
					AND dr.documento_fac = $3
				ORDER BY dr.fecha ASC
			`,
			values: [serie, tipo_transaccion, Number(documento)],
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createRecibo = async ({ body }, res) => {
	try {
		const { rcDetalles, tranEncabezado } = body;
		const rcDet = completarRcDet(rcDetalles, tranEncabezado);
		const rcEnc = completarRcEnc(rcDet, tranEncabezado);

		console.log('----- RC_ENC -----');
		await bulkInsertQuery(tablesName.RC_ENC, rcEnc);
		console.log('----- RC_DET -----');
		await bulkInsertQuery(tablesName.RC_DETALLE, rcDet);

		res.status(200).json({ results: 'OK' });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateRecibo = async ({ query, body }, res) => {
	try {
		const results = await updateQuery(tablesName.RC_ENC, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteRecibo = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.RC_ENC, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

/* **************************************************************
 * Detalle Recibo
 * **************************************************************/
export const getDetalleRecibo = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.RC_DETALLE,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllDetalleRecibo = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createDetalleRecibo = async ({ body }, res) => {
	try {
		const payload = {
			...body,
			fecha: getGuatemalaTimestamp(),
		};

		const results = await insertQuery(tablesName.RC_DETALLE, payload);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateDetalleRecibo = async ({ query, body }, res) => {
	try {
		const results = await updateQuery(tablesName.RC_DETALLE, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteDetalleRecibo = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.RC_DETALLE, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
