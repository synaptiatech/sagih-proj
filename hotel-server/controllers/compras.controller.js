import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';
import { toGuatemalaTimestamp } from '../utils/formatos.js';

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

const compraObject = ({ correlativo, compras }) => {
	return {
		serie: correlativo.serie,
		tipo_transaccion: correlativo.tipo_transaccion,
		documento: correlativo.siguiente || compras.documento,
		fecha: toGuatemalaTimestamp(compras.fecha),
		proveedor: compras.codigo,
		descripcion: compras.descripcion,
		total: compras.total,
		iva: compras.iva,
	};
};

export const createCompras = async ({ body }, res) => {
	try {
		let data = body;
		let toSave = {
			...data,
			fecha: toGuatemalaTimestamp(data.fecha),
		};

		const results = await insertQuery(tablesName.COMPRAS, toSave);
		return res.status(200).json('OK');
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateCompras = async ({ query, body }, res) => {
	try {
		const toUpdate = {
			...body,
		};

		if (toUpdate.fecha) {
			toUpdate.fecha = toGuatemalaTimestamp(toUpdate.fecha);
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
