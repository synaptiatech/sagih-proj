import { pool } from '../config/db.js';
import { __dirname, logger } from '../utils/log.utils.js';

/**
 * Función para realizar una consulta de tipo GET con join
 * @param {string} funcName Nombre de la tabla
 * @param {Object} params Objeto con los datos a buscar
 * @returns Se retorna un arreglo con los datos encontrados
 */
export const getByFunction = async (funcName, params) => {
	const keys = Object.keys(params);
	const values = Object.values(params);

	const query = `SELECT * FROM ${funcName} (${keys.map(
		(_key, index) => `$${index + 1}`
	)})`;

	const { rows } = await pool.query(query, values);
	return rows;
};

/**
 * Función para realizar una consulta de tipo SELECT
 * @param {string} table Nombre de la tabla
 * @param {Object} where Objeto con los datos a buscar
 */
export const getOne = async (table, where) => {
	const keys = Object.keys(where);
	const values = Object.values(where);

	const st_where =
		keys.length > 0
			? `WHERE ${keys
					.map((key, index) => `${key} = $${index + 1}`)
					.join(' AND ')}`
			: '';

	const query = `SELECT * FROM ${table} ${st_where}`;
	console.log({ query, values });

	const { rows } = await pool.query(query, values);
	return rows.pop();
};

/**
 *
 * @param {string} table Tabla a consultar
 * @param {{ columna: string, relacion: string, valor: any }[]} where Objeto con los datos a buscar
 * @param {{ [key: string]: string }} columns Objeto con los datos a buscar
 * @returns {{ query: string, values: any[] }}
 */
export const getOneCopy = async (table, where, columns = {}) => {
	const values = [];

	const st_where =
		where.length > 0
			? `WHERE ${where
					.map((item, index) => {
						values.push(
							item.relacion !== '~~*'
								? item.valor
								: `%${item.valor.toString().toLowerCase()}%`
						);

						if (item.columna.includes('fecha')) {
							return `${item.columna}::date ${item.relacion} $${index + 1}::date`;
						}

						return `${item.columna} ${item.relacion} $${index + 1}`;
					})
					.join(' AND ')}`
			: '';

	const cols =
		Object.keys(columns).length > 0
			? Object.keys(columns).join(' , ')
			: '*';

	const query = `SELECT ${cols} FROM ${table} ${st_where}`;
	return { query, values };
};

export const getFromQueryCopy = async ({ query, valores = [] }) => {
	logger(__dirname, 'getFromQuery', { query, valores });

	const { rows } = await pool.query(query, valores);
	return { rows };
};

export const getAll = (table) => getOne(table, {});

export const getWithParmas = async (table, where, values) => {
	const st_where = where !== '' ? `WHERE ${where}` : '';
	const query = `SELECT * FROM ${table} ${st_where}`;
	console.log({ query, values });

	const { rows } = await pool.query(query, values);
	return rows;
};

/**
 * Función para realizar una consulta de tipo SELECT
 * @param {string} table Nombre de la tabla
 * @param {Object} where Objeto con los datos a buscar
 */
export const getWithFilter = async (table, where) => {
	const keys = Object.keys(where);
	const values = Object.values(where);

	const st_where =
		keys.length > 0
			? `WHERE ${keys
					.map(
						(key, index) =>
							`CAST(${key} AS VARCHAR) ILIKE $${index + 1}`
					)
					.join(' OR ')}`
			: '';

	const query = `SELECT * 
	FROM ${table} 
	${st_where}`;

	console.log({ query, values });

	const { rows } = await pool.query(query, values);
	return rows;
};

/**
 * Obtener el offset para la consulta
 * @param {Number} pageNumber Número de página
 * @param {Number} pageSize Número de registros por página
 * @returns {Number} Offset para la consulta
 */
const getOffset = (pageNumber, pageSize) => {
	return (pageNumber - 1) * pageSize;
};

/**
 * Obtener el número de registros de una tabla
 * @param {String} table Nombre de la tabla
 * @returns {Promise<number|string>} Número de registros
 */
const getCount = async (table) => {
	try {
		const { rows } = await pool.query(`SELECT COUNT(*) FROM ${table}`);
		return rows[0].count;
	} catch (error) {
		throw error;
	}
};

/**
 * Obtener el número de la siguiente página
 * @param {Number} page Numero de pagina
 * @param {Number} limit Numero de registros por pagina
 * @param {Number} total Numero total de registros
 * @returns {number|null} Numero de la siguiente pagina
 */
const getNextPage = (page, limit, total) => {
	return page * limit < total ? page + 1 : null;
};

/**
 * Obtener el número de la pagina anterior
 * @param {Number} page Numero de pagina
 * @returns {number|null} Numero de la pagina anterior
 */
const getPreviousPage = (page) => {
	return page > 1 ? page - 1 : null;
};

/**
 * Función para realizar una consulta de tipo SELECT con paginación y ordenamiento
 * @param {String} table Nombre de la tabla
 * @param {Number} numberPage Número de página
 * @param {Number} numberTuples Número de registros por página
 * @param {Object} search Objeto con los datos a buscar
 * @param {String} colOrder Columna por la que se ordenará
 * @param {String} dirSort Tipo de ordenamiento
 */
export const getWithPaginate = (
	table,
	numberPage,
	numberTuples,
	search,
	colOrder,
	dirSort
) => {
	return new Promise(async (resolve, reject) => {
		try {
			const page = parseInt(numberPage, 10) || 1;
			const limit = parseInt(numberTuples, 10) || 10;
			const offset = getOffset(page, limit);

			const order = colOrder || 'codigo';
			const sort = dirSort || 'ASC';

			let options = {
				offset,
				limit,
			};

			if (Object.keys(search).length > 0) {
				options.where = `WHERE ${Object.keys(search)
					.map((key, index) => `${key} = $${index + 1}`)
					.join(' AND ')}`;
			}

			const count = await getCount(table);

			const query = `SELECT * 
			FROM ${table}
			${options.where || ''}
			ORDER BY ${order} ${sort}
			LIMIT ${options.limit}
			OFFSET ${options.offset}`;

			console.log(query, Object.values(search));

			const { rows } = await pool.query(query, Object.values(search));

			const pages = limit > 0 ? Math.ceil(count / limit) : 1;

			resolve({
				previosPage: getPreviousPage(page),
				currentPage: page,
				nextPage: getNextPage(page, limit, count),
				total: count,
				limit,
				pages,
				rows,
			});
		} catch (error) {
			console.log({ message: error });
			reject(error);
		}
	});
};

/**
 * Obtener el nombre de las columnas y el tipo de dato de una tabla
 * @param {string} table Nombre de la tabla
 * @returns {{ column_name: string, udt_name: string }[]} Columnas de la tabla
 */
const getColumnsNames = async (table) => {
	const { rows } = await pool.query(
		`SELECT 
			column_name,
			udt_name
		FROM information_schema.columns WHERE table_name = $1`,
		[table]
	);

	return rows;
};

/**
 * Obtener la clausula WHERE de una consulta
 * @param {Record<string, any>} query Objeto con los datos a buscar
 * @returns {[string, any[]]} Cláusula WHERE y valores
 */
const getWhereClause = (query) => {
	const values = [];

	const conditions = Object.entries(query).map(([key, value], index) => {
		values.push(value);
		return `${key} = $${index + 1}`;
	});

	const str = `${conditions.join(' AND ')} `;
	return [str, values];
};

const getOperatorPRel = (relacion) => {
	switch (relacion) {
		case 'igual':
			return '=';
		case 'del':
			return '>';
		case 'al':
			return '<';
		case 'desde':
			return '>=';
		case 'hasta':
			return '<=';
		case 'diferente':
			return '<>';
		case 'contiene':
			return 'LIKE';
		default:
			return relacion;
	}
};

/**
 * Obtener la cláusula WHERE de una consulta para buscar por operador definido por el usuario
 * @param {Record<string, string>[]} query Arreglo de objetos con la columna, operador y valor a buscar
 * @param {number} acc Acumulado de valores
 * @returns {[string, any[]]}
 */
const getCustomWhereClause = (query, acc) => {
	const values = [];

	const conditions = query.map(({ column, operator, value }, index) => {
		values.push(value);

		if (column.includes('fecha')) {
			return `${column}::date ${getOperatorPRel(operator)} $${
				acc + index + 1
			}::date`;
		}

		return `${column} ${getOperatorPRel(operator)} $${acc + index + 1}`;
	});

	const str = `${conditions.join(' AND ')} `;
	return [str, values];
};

/**
 * Obtener la clausula WHERE de una consulta para buscar por operador ILIKE
 * @param {string} table Nombre de la tabla
 * @param {string} q Valor a buscar
 * @param {number} acc Acumulado de valores
 * @returns {[string, any[]]} Cláusula WHERE
 */
const getFilterWhereClause = async (table, q, acc) => {
	const columns = await getColumnsNames(table);
	const values = [];

	const filter = columns
		.map((column, index) => {
			const placeholder = `$${index + acc + 1}`;

			if (column.udt_name === 'text' || column.udt_name === 'varchar') {
				values.push(`%${q}%`);
				return `${column.column_name} ILIKE ${placeholder}`;
			}

			if (
				column.udt_name === 'timestamp' ||
				column.udt_name === 'timestamptz' ||
				column.udt_name === 'date'
			) {
				values.push(`%${q}%`);
				return `${column.column_name}::text ILIKE ${placeholder}`;
			}

			const numericValue = Number(q);
			if (!Number.isNaN(numericValue)) {
				values.push(numericValue);
				return `${column.column_name} = ${placeholder}`;
			}

			return null;
		})
		.filter(Boolean)
		.join(' OR ');

	return [filter, values];
};

/**
 * Obtener la clausula ORDER BY de una consulta
 * @param {Record<string, 'ASC' | 'DESC'>} sort Objeto con los datos a ordenar
 * @returns {string} Cláusula ORDER BY
 */
const sortFormat = (sort) => {
	const sorts = Object.entries(sort).map(([key, value]) => `${key} ${value}`);
	return `${sorts.join(', ')}`;
};

export const getQueryMethod = async ({
	table,
	columns = {},
	query = {},
	sort = {},
	limit = undefined,
	offset = undefined,
	customWhere = undefined,
	q = undefined,
	pageNumber = undefined,
	pageSize = undefined,
}) => {
	const kCols = Object.keys(columns);
	const filters = [];
	const values = [];

	let strTableName = table;

	if (table.includes('fn')) {
		strTableName += '(';
		const params = Object.values(query).map((val, index) => {
			values.push(val);
			return `$${index + 1}`;
		});
		strTableName += `${params.join(', ')})`;
	} else {
		const [strWhere, valsWhere] = getWhereClause(query);

		if (valsWhere.length > 0) {
			filters.push(strWhere);
			valsWhere.forEach((val) => values.push(val));
		}
	}

	let sql = `SELECT ${kCols.length > 0 ? kCols : '*'} FROM ${strTableName}`;

	if (customWhere) {
		const [customWhereClause, customWhereValues] = getCustomWhereClause(
			customWhere,
			values.length
		);

		if (customWhereValues.length > 0) {
			filters.push(`(${customWhereClause})`);
			customWhereValues.forEach((val) => values.push(val));
		}
	}

	if (q) {
		const [qWhere, qValues] = await getFilterWhereClause(
			table,
			q,
			values.length
		);

		if (qWhere && qValues.length > 0) {
			filters.push(`(${qWhere})`);
			qValues.forEach((val) => values.push(val));
		}
	}

	if (filters.length > 0) {
		sql += `\nWHERE ${filters.join(' AND ')}`;
	}

	const clauseSort = sortFormat(sort);

	if (clauseSort !== '') {
		sql += `\nORDER BY ${clauseSort}`;
	}

	const hasPagination = pageNumber && pageSize;
	if (!hasPagination) {
		if (limit) {
			sql += `\nLIMIT ${limit}`;
		}

		if (offset) {
			sql += `\nOFFSET ${offset}`;
		}
	}

	let count = 0;

	if (hasPagination) {
		const pageOffset = getOffset(pageNumber, pageSize);
		const paginatedSql = `${sql}\nOFFSET ${pageOffset} LIMIT ${pageSize}`;

		logger(__dirname, 'getQueryMethod', { sql: paginatedSql, values });

		const { rows } = await pool.query(paginatedSql, values);
		count = rows.length;

		return { rows, count };
	}

	logger(__dirname, 'getQueryMethod', { sql, values });

	const { rows } = await pool.query(sql, values);
	count = rows.length;

	return { rows, count };
};

export const getOneQueryMethod = async ({
	table,
	columns = {},
	query = {},
	sort = {},
	limit = 1,
	offset = undefined,
}) => {
	const { rows } = await getQueryMethod({
		table,
		columns,
		query,
		sort,
		limit,
		offset,
	});

	return rows[0];
};

/**
 *
 * @param {{ sql: string, values: any[] }} param
 * @returns {Object[]} Arreglo de objetos
 */
export const getFromQuery = async ({ sql, values = [] }) => {
	logger(__dirname, 'getFromQuery', { sql, values });

	const { rows } = await pool.query(sql, values);
	return rows;
};

/**
 * Función para realizar una consulta de tipo INSERT
 * @param {string} table Nombre de la tabla
 * @param {Object} rows Objeto con los datos a insertar
 * @returns Se retorna un arreglo con los datos insertados
 */
export const insertQuery = async (table, rows) => {
	if (rows.codigo === undefined || rows.codigo >= 0) delete rows.codigo;

	const keys = Object.keys(rows);
	const values = Object.values(rows);

	const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys
		.map((_key, index) => `$${index + 1}`)
		.join(',')}) RETURNING *`;

	console.log({ query, values });

	const results = await pool.query(query, values);
	return results;
};

/**
 * Función para realizar una consulta de tipo INSERT con multiples registros
 * @param {string} table Nombre de la tabla
 * @param {Object[]} rows Objeto con los datos a insertar
 * @returns Se retorna un arreglo con los datos insertados
 */
export const bulkInsertQuery = async (table, rows) => {
	for await (const row of rows) {
		console.log('-----> ', row);
		await insertQuery(table, row);
	}

	return { message: 'Datos insertados correctamente' };
};

/**
 * Función para realizar una consulta de tipo UPDATE con multiples registros
 * @param {string} table Nombre de la tabla
 * @param {Object[]} rows Objeto con los datos a insertar
 * @param {Object} where Objeto con los datos de la condición WHERE
 * @returns Se retorna un arreglo con los datos insertados
 */
export const bulkUpdateQuery = async (table, rows, where) => {
	for await (const row of rows) {
		await updateQuery(table, row, where);
	}

	return { message: 'Datos insertados correctamente' };
};

/**
 * Función para realizar una consulta de tipo UPDATE
 * @param {string} table Nombre de la tabla
 * @param {Object} rows Objeto con los datos a insertar
 * @param {Object} where Objeto con los datos de la condición WHERE
 * @returns Se retorna un arreglo con los datos insertados
 */
export const updateQuery = async (table, rows, where) => {
	const rowsKeys = Object.keys(rows);
	const rowsValues = Object.values(rows);

	const whereKeys = Object.keys(where);
	const whereValues = Object.values(where);

	const query = `UPDATE ${table} 
	SET ${rowsKeys.map((key, index) => `${key} = $${index + 1}`).join(',')} 
	WHERE ${whereKeys
		.map((key, index) => `${key} = $${index + rowsKeys.length + 1}`)
		.join(' AND ')} 
		 RETURNING *`;

	const values = [...rowsValues, ...whereValues];

	logger(__dirname, 'updateQuery', { query, values });

	const { rows: result } = await pool.query(query, values);
	return result;
};

/**
 * Función para realizar una consulta de tipo DELETE
 * @param {string} table Nombre de la tabla
 * @param {Object} where Objeto con los datos de la condición WHERE
 */
export const deleteQuery = async (table, where) => {
	const whereKeys = Object.keys(where);
	const whereValues = Object.values(where);

	const query = `DELETE FROM ${table} WHERE ${whereKeys
		.map((key, index) => `${key} = $${index + 1}`)
		.join(' AND ')}
		RETURNING *`;

	const results = await pool.query(query, whereValues);
	return results;
};
