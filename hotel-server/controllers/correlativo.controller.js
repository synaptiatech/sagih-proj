import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getItem = async ({ query, body }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.CORRELATIVO,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getItems = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({
			table: tablesName.CORRELATIVO,
			query,
			...body,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const insertItem = async ({ body }, res) => {
	try {
		const result = await insertQuery(tablesName.CORRELATIVO, body);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateItem = async ({ query, body }, res) => {
	try {
		const result = await updateQuery(tablesName.CORRELATIVO, body, query);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteItem = async ({ query }, res) => {
	try {
		const result = await deleteQuery(tablesName.CORRELATIVO, query);
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};
