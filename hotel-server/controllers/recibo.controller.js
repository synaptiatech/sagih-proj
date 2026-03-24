import { tablesName } from '../consts/names.js';
import {
	bulkInsertQuery,
	deleteQuery,
	getOne,
	getOneQueryMethod,
	getQueryMethod,
	getWithPaginate,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
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

// TODO: Completar implementación
export const getRecibosPorDocumento = async ({ query, body }, res) => {
	try {
		res.status(200).json([]);
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
		const results = await insertQuery(tablesName.RC_DETALLE, body);
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
