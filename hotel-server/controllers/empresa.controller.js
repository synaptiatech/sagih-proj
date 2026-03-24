import { tablesName } from '../consts/names.js';
import { getOneQueryMethod, insertQuery, updateQuery } from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import { __dirname } from '../utils/log.utils.js';

export const getOneItem = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.EMPRESA,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getItem = async ({ query }, res) => {
	try {
		const result = await getOneQueryMethod({
			table: tablesName.EMPRESA,
			query,
		});
		res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

const createInfo = async (data) => {
	try {
		const res = await insertQuery(tablesName.EMPRESA, data);
		return res;
	} catch (error) {
		throw error;
	}
};

const updateInfo = async (data) => {
	try {
		const body = Object.assign({}, data);
		delete body.codigo;
		const res = await updateQuery(tablesName.EMPRESA, body, {
			codigo: data.codigo,
		});
		return res;
	} catch (error) {
		errorHandler(res, error);
	}
};

export const setItem = async ({ body }, res) => {
	let response = {};
	if (body.codigo) {
		response = await updateInfo(body);
	} else {
		response = await createInfo(body);
	}
	res.status(200).json(response);
};

/**
 * Save image in /storage folder and save the path in database
 * @param {import('express').Request} req Request object
 * @param {import('express').Response} res Response object
 */
export const uploadImage = ({ files, user }, res) => {
	try {
		if (!files || Object.keys(files).length === 0)
			throw { message: 'No hay archivos para subir.' };

		let { image } = files;
		let { name } = image;

		let ext = name.split('.').pop();
		let path = `${__dirname}/../storage/logo.${ext}`;
		console.log({ image, name, path });

		image.mv(path, (err) => {
			if (err) throw err;
		});
		res.status(200).json({ path, name: `logo.${ext}` });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getImage = (req, res) => {
	console.log(req.query);
	try {
		const { image } = req.query;
		res.sendFile(`${__dirname}/../storage/${image}`);
	} catch (error) {
		errorHandler(res, error);
	}
};
