import { tablesName } from '../consts/names.js';
import {
	deleteQuery,
	getFromQuery,
	getOneQueryMethod,
	insertQuery,
	updateQuery,
} from '../db/querys.js';
import { errorHandler } from '../utils/error.utils.js';

export const getItem = async ({ query }, res) => {
	try {
		const results = await getOneQueryMethod({
			table: tablesName.PERMISO,
			query,
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const getItems = async ({ query, body }, res) => {
	try {
		const { perfil } = query;

		const results = await getFromQuery({
			sql: `select pag.indice , 
	pag.codigo pagina , pag.nombre pag_nombre , 
	func.codigo funcion , func.nombre func_nombre ,
	perm.estado
from permiso perm
  inner join pagina pag on pag.codigo = perm.pagina
  inner join funcion func on func.codigo = perm.funcion
  inner join perfil p on p.codigo = perm.perfil 
where 
	p.codigo = $1
order by pag.indice asc, func.nombre asc`,
			values: [perfil],
		});
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const postItem = async ({ body }, res) => {
	try {
		const results = await insertQuery(tablesName.PERMISO, body);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const putItem = async ({ body, query }, res) => {
	try {
		const results = await updateQuery(tablesName.PERMISO, body, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};

export const deleteItem = async ({ query }, res) => {
	try {
		const results = await deleteQuery(tablesName.PERMISO, query);
		res.status(200).json(results);
	} catch (error) {
		errorHandler(res, error);
	}
};
