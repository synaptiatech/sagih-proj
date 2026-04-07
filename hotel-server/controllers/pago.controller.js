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
import {
	getGuatemalaTimestamp,
	toGuatemalaTimestamp,
} from '../utils/formatos.js';

/**
 * Obtener un tipo de pago por query
 */
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

/**
 * Obtener catálogo de tipos de pago
 * NUEVO: usar este endpoint para llenar combos/selects de tipo de pago
 */
export async function getTiposPago(req, res) {
	try {
		const results = await getQueryMethod({
			table: tablesName.TIPO_PAGO,
			sort: { nombre: 'ASC' },
		});

		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}

/**
 * Obtener pagos reales para el grid
 * - Solo posteriores al último cierre
 * - Fecha/hora real
 * - Orden descendente por timestamp real
 */
export async function getAllPago({ body }, res) {
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
			filters.push(`rd.fecha > $${values.length}::timestamp`);
		}

		if (q !== '') {
			values.push(`%${q}%`);
			const searchPlaceholder = `$${values.length}`;

			filters.push(`(
				rd.codigo::text ILIKE ${searchPlaceholder}::text OR
				rd.serie::text ILIKE ${searchPlaceholder}::text OR
				rd.tipo_transaccion::text ILIKE ${searchPlaceholder}::text OR
				rd.documento::text ILIKE ${searchPlaceholder}::text OR
				rd.serie_fac::text ILIKE ${searchPlaceholder}::text OR
				rd.ti_tran_fac::text ILIKE ${searchPlaceholder}::text OR
				rd.documento_fac::text ILIKE ${searchPlaceholder}::text OR
				to_char(rd.fecha, 'DD/MM/YYYY HH24:MI:SS') ILIKE ${searchPlaceholder}::text OR
				COALESCE(rd.descripcion, '') ILIKE ${searchPlaceholder}::text OR
				rd.tipo_pago::text ILIKE ${searchPlaceholder}::text OR
				COALESCE(tp.nombre, '') ILIKE ${searchPlaceholder}::text OR
				rd.monto::text ILIKE ${searchPlaceholder}::text
			)`);
		}

		const whereClause =
			filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

		const dataSql = `
			SELECT
				rd.codigo,
				rd.serie,
				rd.tipo_transaccion,
				rd.documento,
				rd.serie_fac,
				rd.ti_tran_fac,
				rd.documento_fac,
				to_char(rd.fecha, 'DD/MM/YYYY HH24:MI:SS') AS fecha,
				rd.fecha AS fecha_real,
				rd.descripcion,
				rd.tipo_pago,
				tp.nombre AS tipo_pago_nombre,
				rd.monto
			FROM detalle_recibo rd
			LEFT JOIN tipo_pago tp
				ON tp.codigo = rd.tipo_pago
			${whereClause}
			ORDER BY rd.fecha DESC
			OFFSET $${values.length + 1}
			LIMIT $${values.length + 2}
		`;

		const countSql = `
			SELECT COUNT(*) AS total
			FROM detalle_recibo rd
			LEFT JOIN tipo_pago tp
				ON tp.codigo = rd.tipo_pago
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

		res.status(200).json({
			rows,
			count: Number(countRows?.[0]?.total || 0),
		});
	} catch (error) {
		errorHandler(res, error);
	}
}

/**
 * Crear tipo de pago
 * Mantiene compatibilidad con tu comportamiento actual
 */
export async function createPago({ body }, res) {
	try {
		const results = await insertQuery(tablesName.TIPO_PAGO, body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}

/**
 * Actualizar detalle de pago/recibo
 */
export async function updatePago({ query, body }, res) {
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

		const results = await updateQuery(tablesName.RC_DETALLE, toUpdate, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
}

/**
 * Eliminar pago/detalle de recibo
 * Si ya no quedan detalles, elimina encabezado de recibo
 */
export async function deletePago({ body }, res) {
	try {
		await deleteQuery(tablesName.RC_DETALLE, {
			codigo: body.codigo,
		});

		const detailCountRows = await getFromQuery({
			sql: `
				SELECT COUNT(*) AS total
				FROM detalle_recibo
				WHERE serie = $1
				  AND tipo_transaccion = $2
				  AND documento = $3
			`,
			values: [body.serie, body.tipo_transaccion, body.documento],
		});

		const totalDetalles = Number(detailCountRows?.[0]?.total || 0);

		if (totalDetalles === 0) {
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
