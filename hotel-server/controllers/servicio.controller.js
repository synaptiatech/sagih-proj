import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getOneQueryMethod,
	getQueryMethod,
	getWithFilter,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getTipoServicio = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.TIPO_SERVICIO,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllTipoServicios = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createTipoServicios = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.TIPO_SERVICIO, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateTipoServicios = async (req, res) => {
	try {
		const tipo = req.body;
		delete tipo.codigo;
		const results = await updateQuery(
			tablesName.TIPO_SERVICIO,
			tipo,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteTipoServicios = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.TIPO_SERVICIO, req.query);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getParametros = async (req, res) => {
	try {
		let { rows } = await getQueryMethod({
			table: tablesName.TIPO_SERVICIO,
		});
		res.status(200).json({ tipo: rows });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getServicioByFiltering = async (req, res) => {
	try {
		const results = await getWithFilter(tablesName.SERVICIO, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getDataForReportes = async (req, res) => {
	try {
		const { rows: servicios } = await getQueryMethod({
			table: tablesName.SERVICIO,
		});
		const { rows: clientes } = await getQueryMethod({
			table: tablesName.CLIENTE,
		});
		const { rows: habitacion } = await getQueryMethod({
			table: tablesName.HABITACION,
		});
		const { rows: tiTran } = await getQueryMethod({
			table: tablesName.TI_TRAN,
		});
		res.status(200).json({ servicios, clientes, habitacion, tiTran });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getServicio = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.SERVICIO,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllServicios = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createServicios = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.SERVICIO, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateServicios = async (req, res) => {
	try {
		const servicio = req.body;
		delete servicio.codigo;
		const results = await updateQuery(
			tablesName.SERVICIO,
			servicio,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteServicios = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.SERVICIO, req.query);
		res.send(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
