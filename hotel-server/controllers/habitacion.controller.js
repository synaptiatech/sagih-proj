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

export const getArea = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.AREA,
			query: query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllAreas = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createArea = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.AREA, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateArea = async (req, res) => {
	try {
		const area = req.body;
		delete area.codigo;
		const results = await updateQuery(tablesName.AREA, area, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteArea = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.AREA, req.query);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getTipo = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.TIPO_HABITACION,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllATipo = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createTipo = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.TIPO_HABITACION, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateTipo = async (req, res) => {
	try {
		const tipo = req.body;
		delete tipo.codigo;
		const results = await updateQuery(
			tablesName.TIPO_HABITACION,
			tipo,
			req.query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteTipo = async (req, res) => {
	try {
		const results = await deleteQuery(
			tablesName.TIPO_HABITACION,
			req.query
		);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getNivel = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.NIVEL,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllANivel = async ({ query, body }, res) => {
	try {
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createNivel = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.NIVEL, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateNivel = async (req, res) => {
	try {
		const nivel = req.body;
		delete nivel.codigo;
		const results = await updateQuery(tablesName.NIVEL, nivel, req.query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteNivel = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.NIVEL, req.query);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getParametros = async (req, res) => {
	try {
		const { rows: tipo } = await getQueryMethod({
			table: tablesName.TIPO_HABITACION,
		});
		const { rows: area } = await getQueryMethod({ table: tablesName.AREA });
		const { rows: nivel } = await getQueryMethod({
			table: tablesName.NIVEL,
		});
		res.status(200).json({ tipo, area, nivel });
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getHabitacion = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.HABITACION,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getAllHabitacions = async ({ query, body }, res) => {
	try {
		await getFromQuery({ sql: 'CALL sp_update_hab()' });
		const results = await getQueryMethod({ ...body, query });
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const createHabitacion = async (req, res) => {
	try {
		const results = await insertQuery(tablesName.HABITACION, req.body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const updateHabitacion = async ({ query, body }, res) => {
	try {
		const habitacion = body;
		delete habitacion.codigo;
		const results = await updateQuery(
			tablesName.HABITACION,
			habitacion,
			query
		);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteHabitacion = async (req, res) => {
	try {
		const results = await deleteQuery(tablesName.HABITACION, req.query);
		res.status(204).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
