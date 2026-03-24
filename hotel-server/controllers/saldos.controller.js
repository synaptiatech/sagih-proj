import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getFromQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getItem = async ({ query, body }, res) => {
	try {
		console.log('GET ITEM', { query, body });
		res.status(200).json({ result: 'OK' });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getItems = async ({ query, body }, res) => {
	try {
		console.log('GET ITEMS', { query, body });
		res.status(200).json({ results: 'OK' });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const insertItem = async ({ body }, res) => {
	try {
		console.log('INSERT ITEM', { body });
		const result = await getFromQuery({
			sql: 'call sp_saldos()',
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateItem = async ({ query, body }, res) => {
	try {
		console.log('UPDATE ITEM', { query, body });
		res.status(200).json({ result: 'OK' });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteItem = async ({ query }, res) => {
	try {
		console.log('DELETE ITEM', { query });
		res.status(200).json({ result: 'OK' });
	} catch (error) {
		errorHandler(res, error);
	}
};
