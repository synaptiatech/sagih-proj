import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getFromQuery,
	getOneQueryMethod,
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

export const getCompras = async ({ body }, res) => {
	try {
		const pageNumber = Number(body?.pageNumber || 1);
		const pageSize = Number(body?.pageSize || 10);
		const offset = (pageNumber - 1) * pageSize;
		const q = `${body?.q || ''}`.trim();

		const cierreRows = await getFromQuery({
			sql: `
				SELECT fecha_cierre
				FROM cierre
				ORDER BY fecha_cierre DESC
				LIMIT 1
			`,
		});

		const ultimoCierre = cierreRows?.[0]?.fecha_cierre || null;

		const values = [];
		const filters = [];

		if (ultimoCierre) {
			values.push(toGuatemalaTimestamp(ultimoCierre));
			filters.push(`pt.fecha > $${values.length}::timestamp`);
		}

		if (q !== '') {
			values.push(`%${q}%`);
			const searchPlaceholder = `$${values.length}`;
			filters.push(`(
				pt.serie::text ILIKE ${searchPlaceholder}::text OR
				pt.tipo_transaccion::text ILIKE ${searchPlaceholder}::text OR
				pt.documento::text ILIKE ${searchPlaceholder}::text OR
				to_char(pt.fecha, 'DD/MM/YYYY HH24:MI:SS') ILIKE ${searchPlaceholder}::text OR
				COALESCE(pr.nombre, '') ILIKE ${searchPlaceholder}::text OR
				COALESCE(pr.nit, '') ILIKE ${searchPlaceholder}::text OR
				COALESCE(pt.descripcion, '') ILIKE ${searchPlaceholder}::text OR
				pt.iva::text ILIKE ${searchPlaceholder}::text OR
				pt.total::text ILIKE ${searchPlaceholder}::text
			)`);
		}

		const whereClause =
			filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

		const dataSql = `
			SELECT
				pt.codigo,
				pt.serie,
				pt.tipo_transaccion,
				pt.documento,
				to_char(pt.fecha, 'DD/MM/YYYY HH24:MI:SS') AS fecha,
				pt.fecha AS fecha_real,
				pr.nombre,
				pr.nit,
				pt.descripcion,
				pt.iva,
				pt.total
			FROM pp_tranenc pt
			LEFT JOIN proveedor pr
				ON pr.codigo = pt.proveedor
			${whereClause}
			ORDER BY pt.fecha DESC
			OFFSET $${values.length + 1}
			LIMIT $${values.length + 2}
		`;

		const countSql = `
			SELECT COUNT(*) AS total
			FROM pp_tranenc pt
			LEFT JOIN proveedor pr
				ON pr.codigo = pt.proveedor
			${whereClause}
		`;

		const dataValues = [...values, offset, pageSize];

		const [rows, countRows] = await Promise.all([
			getFromQuery({
				sql: dataSql,
				values: dataValues,
			}),
			getFromQuery({
				sql: countSql,
				values,
			}),
		]);

		return res.status(200).json({
			rows,
			count: Number(countRows?.[0]?.total || 0),
		});
	} catch (error) {
		errorHandler(res, error);
	}
};

export const compraObject = ({ correlativo, compras }) => {
	const rawFecha = compras?.fecha;

	return {
		serie: correlativo.serie,
		tipo_transaccion: correlativo.tipo_transaccion,
		documento: correlativo.siguiente || compras.documento,
		fecha: rawFecha
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

		const toSave = {
			...data,
			fecha: data.fecha
				? toGuatemalaTimestamp(data.fecha)
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
			if (
				toUpdate.fecha === null ||
				toUpdate.fecha === undefined ||
				`${toUpdate.fecha}`.trim() === ''
			) {
				delete toUpdate.fecha;
			} else {
				toUpdate.fecha = toGuatemalaTimestamp(toUpdate.fecha);
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
