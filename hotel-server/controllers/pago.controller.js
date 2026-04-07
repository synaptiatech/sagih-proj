'use strict';

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

export async function getPago({ query }, res) {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.TIPO_PAGO,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}
export async function getAllPago({ query, body }, res) {
	try {
		const results = await getQueryMethod({
			...body,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}
export function createPago({ body }, res) {
	try {
		// CREATE ENCABEZADO RECIBO
		// CREATE DETALLE RECIBO
		const results = insertQuery(tablesName.TIPO_PAGO, body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}

export async function updatePago({ query, body }, res) {
	try {
		// UPDATE DETALLE RECIBO
		const results = await updateQuery(tablesName.RC_DETALLE, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}

export async function deletePago({ body }, res) {
	try {
		// DELETE DETALLE RECIBO
		await deleteQuery(tablesName.RC_DETALLE, {
			codigo: body.codigo,
		});

		// CHECK IF THERE IS ANOTHER DETAIL
		const { rows, count } = await getQueryMethod({
			table: tablesName.RC_DETALLE,
			columns: ['COUNT(*) AS countRcDet'],
			query: {
				serie: body.serie,
				tipo_transaccion: body.tipo_transaccion,
				documento: body.documento,
			},
		});

		if (!count) {
			// DELETE ENCABEZADO RECIBO
			await deleteQuery(tablesName.RC_ENC, {
				serie: body.serie,
				tipo_transaccion: body.tipo_transaccion,
				documento: body.documento,
			});
		}

		res.status(200).json({ message: 'Pago eliminado correctamente' });
	} catch (error) {
		errorHandler(res, error);
	}
}
