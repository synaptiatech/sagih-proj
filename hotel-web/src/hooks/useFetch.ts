import { useQuery } from '@tanstack/react-query';
import api from '../api/server';
import { UseFetchProp } from '../props/UseFetchProp';

const safeStringify = (value: any) => {
	try {
		return JSON.stringify(value ?? {});
	} catch {
		return JSON.stringify({});
	}
};

const parseSafe = (value: any, fallback: any) => {
	try {
		return value ? JSON.parse(value) : fallback;
	} catch {
		return fallback;
	}
};

const fetching = async ({ queryKey }: any) => {
	const [
		_key,
		path,
		table,
		columnsStr,
		queryStr,
		sortStr,
		limit,
		offset,
		q,
		pageNumber,
		pageSize,
		customWhereStr,
	] = queryKey;

	const columns = parseSafe(columnsStr, {});
	const query = parseSafe(queryStr, {});
	const sort = parseSafe(sortStr, {});
	const customWhere = parseSafe(customWhereStr, []);

	const { data } = await api.post(
		path,
		{
			table,
			columns,
			sort,
			limit,
			offset,
			q,
			pageNumber,
			pageSize,
			customWhere,
		},
		{
			params: query,
		}
	);

	return data;
};

const fetchData = async ({ queryKey }: any) => {
	const [_key, path, queryStr] = queryKey;
	const query = parseSafe(queryStr, {});

	const { data } = await api.get(path, {
		params: query,
	});

	return data;
};

const fetchDataPaginated = async ({ queryKey }: any) => {
	const [_key, path, page, limit, orderBy, orderDirection, dataSearch] =
		queryKey;

	const { data } = await api.get(path, {
		params: {
			page,
			limit,
			orderBy,
			orderDirection,
			q: dataSearch,
		},
	});

	return data;
};

const fetchDataFiltered = async ({ queryKey }: any) => {
	const [_key, path, queryStr] = queryKey;
	const query = parseSafe(queryStr, {});

	const { data } = await api.get(path + '/filter', {
		params: query,
	});

	return data;
};

export const useFetch = ({
	path,
	table,
	columns = {},
	query = {},
	sort = {},
	limit,
	offset,
	q = '',
	pageNumber,
	pageSize,
	customWhere = [],
}: UseFetchProp) => {
	return useQuery(
		[
			'data',
			path,
			table,
			safeStringify(columns),
			safeStringify(query),
			safeStringify(sort),
			limit ?? null,
			offset ?? null,
			q ?? '',
			pageNumber ?? null,
			pageSize ?? null,
			safeStringify(customWhere),
		],
		fetching,
		{
			enabled: Boolean(path),
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 1000 * 30,
		}
	);
};

export const useFetchData = ({ path, query = {} }: UseFetchProp) => {
	return useQuery(['data', path, safeStringify(query)], fetchData, {
		enabled: Boolean(path),
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 30,
	});
};

export const useFetchDataPaginated = (
	path: string,
	page: number,
	limit: number,
	orderBy: string,
	orderDirection: string,
	data?: string
) => {
	return useQuery(
		['data', path, page, limit, orderBy, orderDirection, data || ''],
		fetchDataPaginated,
		{
			enabled: Boolean(path),
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 1000 * 15,
		}
	);
};

export const useFetchDataFiltered = (path: string, query: Object) => {
	return useQuery(['data', path, safeStringify(query)], fetchDataFiltered, {
		enabled: Boolean(path),
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 30,
	});
};
