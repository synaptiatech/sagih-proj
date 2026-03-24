import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOne,
	getOneQueryMethod,
	getQueryMethod,
	getWithPaginate,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getTipoFuncion = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.TIPO_FUNCION,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllTipoFuncion = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createTipoFuncion = async ({ body }, res) => {
	try {
		const results = await insertQuery(tablesName.TIPO_FUNCION, body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateTipoFuncion = async ({ body, query }, res) => {
	try {
		const results = await updateQuery(tablesName.TIPO_FUNCION, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteTipoFuncion = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.TIPO_FUNCION, {
			codigo: query.codigo,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getFuncion = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.FUNCION,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllFuncion = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createFuncion = async ({ body }, res) => {
	try {
		const results = await insertQuery(tablesName.FUNCION, body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateFuncion = async ({ body, query }, res) => {
	try {
		const results = await updateQuery(tablesName.FUNCION, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteFuncion = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.FUNCION, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
