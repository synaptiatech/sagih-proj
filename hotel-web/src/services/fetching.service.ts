import api from '../api/server';
import { TypeWithKey } from '../models/TypeWKey';

type axiosProps = {
	path: string;
	data?: Object;
	params?: TypeWithKey<any>;
	query?: TypeWithKey<any>;
	headers?: TypeWithKey<string>;
};

export const dataGet = ({
	path,
	params,
	headers = {
		'Content-Type': 'application/json',
	},
}: axiosProps) => {
	return api.get(path, { headers, params });
};

export const dataGetFromPost = ({
	path,
	query,
	headers = {
		'Content-Type': 'application/json',
	},
}: axiosProps) => {
	return api.post(path, {}, { headers, params: query });
};

export const dataPost = ({
	path,
	data,
	headers = {
		'Content-Type': 'application/json',
	},
}: axiosProps) => {
	return api.post(path, data, { headers });
};

export const dataUpdate = ({
	path,
	data,
	params = {},
	headers = {
		'Content-Type': 'application/json',
	},
}: axiosProps) => {
	return api.put(path, data, { headers, params });
};

export const dataDelete = ({
	path,
	params,
	headers = {
		'Content-Type': 'application/json',
	},
}: axiosProps) => {
	console.log('Making DELETE request with the following parameters:');
	console.log('Path:', path);
	console.log('Headers:', headers);
	console.log('Params:', params);
	return api.delete(path, {
		headers,
		params,
	});
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

export const downloadFile = ({
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
	return api.post(
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
};
