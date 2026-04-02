import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

import { tablesName } from '../consts/names.js';
import { getOneQueryMethod, insertQuery } from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = 'America/Guatemala';

/**
 * Normaliza fecha a Guatemala
 */
const toGuatemalaDate = (value) => {
	if (!value) {
		return dayjs().tz(TZ);
	}

	// viene como string "YYYY-MM-DD HH:mm:ss"
	const parsed = dayjs.tz(value, 'YYYY-MM-DD HH:mm:ss', TZ);

	if (parsed.isValid()) {
		return parsed;
	}

	// fallback
	return dayjs(value).tz(TZ);
};

/**
 * Obtener último cierre
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
 * Crear cierre
 */
export const createItem = async ({ body, user }, res) => {
	try {
		const usuario = await getOneQueryMethod({
			table: tablesName.USUARIO,
			columns: { codigo: 'codigo' },
			query: { usuario: user.usuario },
		});

		const fechaCierre = toGuatemalaDate(body.fecha_cierre);
		const fechaReal = toGuatemalaDate(body.fecha_real);

		const result = await insertQuery(tablesName.CIERRE, {
			usuario: usuario.codigo,

			// 🔥 GUARDAMOS EN FORMATO POSTGRES CORRECTO
			fecha_cierre: fechaCierre.format('YYYY-MM-DD HH:mm:ss'),
			fecha_real: fechaReal.format('YYYY-MM-DD HH:mm:ss'),
		});

		console.log('Cierre guardado correctamente:', {
			fecha_cierre: fechaCierre.format(),
			fecha_real: fechaReal.format(),
		});

		return res.status(200).json(result);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getItems = ({ query, body }, res) => {};
export const updateItem = ({ query, body }, res) => {};
export const deleteItem = ({ query }, res) => {};
