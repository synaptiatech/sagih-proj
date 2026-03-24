import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getPagina = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.PAGINA,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllPagina = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createPagina = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.PAGINA, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updatePagina = async (req, res) => {
	try {
		const results = await updateQuery(
			tablesName.PAGINA,
			req.body,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deletePagina = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.PAGINA, req.query);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
