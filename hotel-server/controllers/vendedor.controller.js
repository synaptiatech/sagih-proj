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

export const getFilteredVendedor = async (req, res) => {
	try {
		const results = await getWithFilter(tablesName.VENDEDOR, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getVendedor = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.VENDEDOR,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllVendedor = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createVendedor = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.VENDEDOR, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateVendedor = async (req, res) => {
	try {
		const results = await updateQuery(
			tablesName.VENDEDOR,
			req.body,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteVendedor = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.VENDEDOR, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
