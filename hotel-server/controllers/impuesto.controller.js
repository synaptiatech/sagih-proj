import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getImpuesto = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.IMPUESTOS,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllImpuesto = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createImpuesto = async (req, res) => {
	try {
		let impuesto = req.body;
		delete impuesto.codigo;
		const results = await insertQuery(tablesName.IMPUESTOS, impuesto);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateImpuesto = async (req, res) => {
	try {
		const impuesto = req.body;
		delete impuesto.codigo;
		const results = await updateQuery(
			tablesName.IMPUESTOS,
			impuesto,
			req.query
		);

		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteImpuesto = async (req, res) => {
	try {
		const codigo = req.query;
		const results = await deleteQuery(tablesName.IMPUESTOS, codigo);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
