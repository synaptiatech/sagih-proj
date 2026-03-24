import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getDepartamento = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.DEPARTAMENTO,
			query,
		});
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getDepartamentos = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getParametros = async (req, res) => {
	try {
		let { rows } = await getQueryMethod({
			table: tablesName.PAIS,
		});
		res.status(200).json(rows);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createDepartamento = async (req, res) => {
	try {
		const results = insertQuery(tablesName.DEPARTAMENTO, req.body);
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateDepartamento = async (req, res) => {
	try {
		const departamento = req.body;
		delete departamento.codigo;
		const results = await updateQuery(
			tablesName.DEPARTAMENTO,
			departamento,
			req.query
		);
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteDepartamento = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.DEPARTAMENTO, req.query);
		res.status(200).send(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
