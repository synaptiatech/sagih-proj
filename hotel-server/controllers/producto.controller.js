import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getProducto = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.PRODUCTO,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getProductos = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createProducto = async ({ body }, res) => {
	try {
		const results = await insertQuery(tablesName.PRODUCTO, body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateProducto = async ({ query, body }, res) => {
	try {
		const producto = body;
		delete producto.codigo;
		const results = await updateQuery(tablesName.PRODUCTO, producto, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteProducto = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.PRODUCTO, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
