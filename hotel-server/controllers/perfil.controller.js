import { tablesName } from '../consts/names.js';
import {
	getWithFilter,
	getAll,
	insertQuery,
	updateQuery,
	deleteQuery,
	getWithPaginate,
	getOneQueryMethod,
	getQueryMethod,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getPerfil = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.PERFIL,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllPerfil = async ({ query, body }, res) => {
	try {
		const { rows } = await getQueryMethod({
			...body,
			table: 'perfil',
			query,
		});
		res.status(200).json(rows);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createPerfil = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.PERFIL, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updatePerfil = async (req, res) => {
	try {
		const results = await updateQuery(
			tablesName.PERFIL,
			req.body,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deletePerfil = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.PERFIL, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
