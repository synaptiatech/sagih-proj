import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getOnePais = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.PAIS,
			query,
		});
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllPaises = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({
			...body,
			query,
		});
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createPais = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.PAIS, req.body);
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updatePais = async (req, res) => {
	try {
		const pais = req.body;
		delete pais.codigo;
		const results = await updateQuery(tablesName.PAIS, pais, req.query);
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deletePais = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.PAIS, req.query);
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
