import api from '../api/server';
import { TypeWithKey } from '../models/TypeWKey';

type axiosProps = {
	path: string;
	data?: Object;
	params?: TypeWithKey<any>;
	query?: TypeWithKey<any>;
	headers?: TypeWithKey<string>;
};

const DEFAULT_HEADERS = {
	'Content-Type': 'application/json',
};

/**
 * Manejo centralizado de errores
 */
const handleRequest = async (request: Promise<any>) => {
	try {
		const response = await request;
		return response;
	} catch (error: any) {
		console.error('API ERROR:', error);

		// Si viene error estructurado del backend
		const message =
			error?.response?.data?.error?.message ||
			error?.response?.data?.message ||
			'Error en la comunicación con el servidor';

		throw new Error(message);
	}
};

export const dataGet = ({
	path,
	params,
	headers = DEFAULT_HEADERS,
}: axiosProps) => {
	return handleRequest(api.get(path, { headers, params }));
};

export const dataGetFromPost = ({
	path,
	query,
	headers = DEFAULT_HEADERS,
}: axiosProps) => {
	return handleRequest(api.post(path, {}, { headers, params: query }));
};

export const dataPost = ({
	path,
	data,
	headers = DEFAULT_HEADERS,
}: axiosProps) => {
	return handleRequest(api.post(path, data, { headers }));
};

export const dataUpdate = ({
	path,
	data,
	params = {},
	headers = DEFAULT_HEADERS,
}: axiosProps) => {
	return handleRequest(api.put(path, data, { headers, params }));
};

export const dataDelete = ({
	path,
	params,
	headers = DEFAULT_HEADERS,
}: axiosProps) => {
	return handleRequest(
		api.delete(path, {
			headers,
			params,
		})
	);
};

export interface DownloadFileProps {
	path: string;
	name: string;
	table: string;
	columns?: Record<string, any>;
	masterColumns?: Record<string, any>;
	detailColumns?: Record<string, any>;
	customWhere?: Record<string, any>;
	where?: Record<string, any>;
	sort?: Record<string, 'ASC' | 'DESC'>;
	sumatoria?: Record<string, any>;
}

/**
 * Descarga de archivos (PDF)
 */
export const downloadFile = async ({
	path,
	name,
	table,
	columns = undefined,
	masterColumns = undefined,
	detailColumns = undefined,
	customWhere = undefined,
	where = {},
	sort = {},
	sumatoria = {},
}: DownloadFileProps) => {
	try {
		const response = await api.post(
			path,
			{
				name,
				table,
				sort,
				columns,
				masterColumns,
				detailColumns,
				customWhere,
				sumatoria,
			},
			{
				responseType: 'arraybuffer',
				headers: {
					Accept: 'application/pdf',
				},
				params: where,
			}
		);

		return response;
	} catch (error: any) {
		console.error('DOWNLOAD ERROR:', error);

		let message = 'Error al generar o descargar el archivo';
		try {
			const text = new TextDecoder().decode(error.response.data);
			const json = JSON.parse(text);
			message = json?.error?.message || json?.message || message;
		} catch {
			// JSON parse falló, se usa el mensaje genérico
		}
		throw new Error(message);
	}
};
