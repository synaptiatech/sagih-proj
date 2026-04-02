import { tablesName } from '../consts/names.js';
import { getOneQueryMethod, insertQuery } from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import { toGuatemalaTimestamp } from '../utils/formatos.js';

/**
 * Obtener un elemento
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getItem = async ({ query, body }, res) => {
	try {
		const response = await getOneQueryMethod({
			...body,
			table: 'cierre',
			query,
			sort: { fecha_cierre: 'DESC' },
		});
		return res.status(200).json(response);
	} catch (error) {
		errorHandler(res, error);
	}
};

/**
 * Obtener todos los elementos
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getItems = ({ query, body }, res) => {};

/**
 * Crear cierre
 * @param {import("express").Request} req
 * @param {import("express").Response} res
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
			fecha_cierre: toGuatemalaTimestamp(body.fecha_cierre),
			fecha_real: toGuatemalaTimestamp(body.fecha_real),
		});

		return res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateItem = ({ query, body }, res) => {};
export const deleteItem = ({ query }, res) => {};
