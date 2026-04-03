import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import {
	getGuatemalaTimestamp,
	toGuatemalaTimestamp,
} from '../utils/formatos.js';

export const getCompra = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.COMPRAS,
			query,
		});
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getCompras = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({
			...body,
			query,
		});
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const compraObject = ({ correlativo, compras }) => {
	const rawFecha = compras?.fecha;

	const hasValidFecha =
		rawFecha instanceof Date ||
		(typeof rawFecha === 'string' &&
			rawFecha.trim() !== '' &&
			rawFecha.trim().toLowerCase() !== 'undefined' &&
			rawFecha.trim().toLowerCase() !== 'null');

	return {
		serie: correlativo.serie,
		tipo_transaccion: correlativo.tipo_transaccion,
		documento: correlativo.siguiente || compras.documento,
		fecha: hasValidFecha
			? toGuatemalaTimestamp(rawFecha)
			: getGuatemalaTimestamp(),
		proveedor: compras.codigo || compras.proveedor,
		descripcion: compras.descripcion,
		total: compras.total,
		iva: compras.iva,
	};
};

export const createCompras = async ({ body }, res) => {
	try {
		const data = body || {};
		const rawFecha = data.fecha;

		const hasValidFecha =
			rawFecha instanceof Date ||
			(typeof rawFecha === 'string' &&
				rawFecha.trim() !== '' &&
				rawFecha.trim().toLowerCase() !== 'undefined' &&
				rawFecha.trim().toLowerCase() !== 'null');

		const toSave = {
			...data,
			fecha: hasValidFecha
				? toGuatemalaTimestamp(rawFecha)
				: getGuatemalaTimestamp(),
		};

		const results = await insertQuery(tablesName.COMPRAS, toSave);
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateCompras = async ({ query, body }, res) => {
	try {
		const toUpdate = {
			...body,
		};

		if (Object.prototype.hasOwnProperty.call(toUpdate, 'fecha')) {
			const rawFecha = toUpdate.fecha;

			const hasValidFecha =
				rawFecha instanceof Date ||
				(typeof rawFecha === 'string' &&
					rawFecha.trim() !== '' &&
					rawFecha.trim().toLowerCase() !== 'undefined' &&
					rawFecha.trim().toLowerCase() !== 'null');

			if (hasValidFecha) {
				toUpdate.fecha = toGuatemalaTimestamp(rawFecha);
			} else {
				delete toUpdate.fecha;
			}
		}

		const results = await updateQuery(tablesName.COMPRAS, toUpdate, query);
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteCompras = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.COMPRAS, req.query);
		return res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
