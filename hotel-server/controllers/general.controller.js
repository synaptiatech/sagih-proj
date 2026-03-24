import { getOneQueryMethod, getQueryMethod } from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getItem = async ({ query, body, user }, res) => {
	try {
		const results = await getOneQueryMethod({
			...body,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getItems = async ({ query, body, user }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
