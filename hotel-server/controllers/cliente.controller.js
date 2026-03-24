import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	getWithFilter,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getParametros = async (req, res) => {
	try {
		const { rows } = await getQueryMethod({
			table: tablesName.PAIS,
		});
		res.status(200).json({ pais: rows });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getFilteredClientes = async (req, res) => {
	const search = req.query;
	try {
		const result = await getWithFilter(tablesName.CLIENTE, search);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getDataForReportes = async (req, res) => {
	try {
		const { rows } = await getQueryMethod({
			table: tablesName.CLIENTE,
		});
		res.status(200).json({ clientes: rows });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getCliente = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.CLIENTE,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllClientes = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createCliente = async ({ body }, res) => {
	try {
		let data = body;
		if (data.extendido_en <= 0) delete data.extendido_en;
		let results = await insertQuery(tablesName.CLIENTE, data);
		console.log({ results });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateCliente = async ({ query, body }, res) => {
	try {
		const cliente = body;
		delete cliente.codigo;
		const results = await updateQuery(tablesName.CLIENTE, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteCliente = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.CLIENTE, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
