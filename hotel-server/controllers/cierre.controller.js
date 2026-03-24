import dayjs from 'dayjs';
import { tablesName } from '../consts/names.js';
import { getOneQueryMethod, insertQuery } from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import { dateToPostgresTimestamp, switchDateToEng } from '../utils/formatos.js';

/**
 * Obtener un elemento
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 */
export const getItem = async ({ query, body }, res) => {
	try {
		const response = await getOneQueryMethod({
			...body,
			table: 'cierre',
			query,
			sort: { fecha_cierre: 'DESC' },
		});
		console.log({ response });
		return res.status(200).json(response);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
 * Obtener todos los elementos
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 */
export const getItems = ({ query, body }, res) => {};

/**
 * Obtener todos los elementos
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 */
export const createItem = async ({ body, user }, res) => {
	try {
		const usuario = await getOneQueryMethod({
			table: tablesName.USUARIO,
			columns: { codigo: 'codigo' },
			query: { usuario: user.usuario },
		});

		const result = await insertQuery(tablesName.CIERRE, {
			usuario: usuario.codigo,
			fecha_cierre: dayjs(
				body.fecha_cierre,
				'YYYY-MM-DD HH:mm:ss'
			).format('YYYY-MM-DDTHH:mm:ss'),
			fecha_real: dayjs(body.fecha_real, 'YYYY-MM-DD HH:mm:ss').format(
				'YYYY-MM-DDTHH:mm:ss'
			),
		});
		return res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
 * Obtener todos los elementos
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 */
export const updateItem = ({ query, body }, res) => {};

/**
 * Obtener todos los elementos
 * @param {import("express").Request} req Request
 * @param {import("express").Response} res Response
 */
export const deleteItem = ({ query }, res) => {};
