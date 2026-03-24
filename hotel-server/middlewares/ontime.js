import { getOneQueryMethod } from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

/**
 * Validate if the date in the request is on time to current cicle
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns
 */
export const ontime = async (req, res, next) => {
	try {
		console.log({ headers: req.headers });
		if (!req.headers['fecha-operation'])
			throw new Error('No se ha enviado la fecha');

		const date = req.headers['fecha-operation'];
		const lastClosing = await getOneQueryMethod({
			table: 'cierre',
			columns: { fecha_cierre: 'cierre' },
			sort: { fecha_cierre: 'DESC' },
			limit: 1,
		});

		let operateDate = new Date(date);
		let closeDate = new Date(lastClosing.fecha_cierre);

		console.log({
			date,
			lastDate: lastClosing.fecha_cierre,
			opDate: operateDate.toISOString(),
			clDate: closeDate.toISOString(),
			result: operateDate > closeDate,
		});
		if (operateDate > closeDate) next();
		else
			throw new Error(
				'La operación no se puede realizar, ya se ha realizado el cierre para la fecha de la operación'
			);
	} catch (error) {
		errorHandler(res, error);
	}
};
