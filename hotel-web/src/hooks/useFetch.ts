import { useQuery } from '@tanstack/react-query';
import api from '../api/server';
import { UseFetchProp } from '../props/UseFetchProp';

const fetching = async ({ queryKey }: any) => {
	const { data } = await api.post(
		queryKey[1],
		{
			table: queryKey[2],
			columns: queryKey[3],
			sort: queryKey[5],
			limit: queryKey[6],
			offset: queryKey[7],
			q: queryKey[8],
			pageNumber: queryKey[9],
			pageSize: queryKey[10],
			customWhere: queryKey[11],
		},
		{
			params: queryKey[4],
		}
	);
	return data;
};

const fetchData = async ({ queryKey }: any) => {
	const { data } = await api.get(queryKey[1], {
		params: queryKey[2],
	});
	return data;
};

const fetchDataPaginated = async ({ queryKey }: any) => {
	const { data } = await api.get(queryKey[1], {
		params: {
			page: queryKey[2],
			limit: queryKey[3],
			orderBy: queryKey[4],
			orderDirection: queryKey[5],
			q: queryKey[6],
		},
	});
	return data;
};

const fetchDataFiltered = async ({ queryKey }: any) => {
	const { data } = await api.get(queryKey[1] + '/filter', {
		params: queryKey[2],
	});
	return data;
};

export const useFetch = ({
	path,
	table,
	columns = {},
	query = {},
	sort = {},
	limit = NaN,
	offset = NaN,
	q = '',
	pageNumber = NaN,
	pageSize = NaN,
	customWhere = [],
}: UseFetchProp) => {
	try {
		return useQuery(
			[
				'data',
				path,
				table,
				columns,
				query,
				sort,
				limit,
				offset,
				q,
				pageNumber,
				pageSize,
				customWhere,
			],
			fetching
		);
	} catch (error) {
		throw new Error("Can't fetch data");
	}
};

export const useFetchData = ({ path, query }: UseFetchProp) => {
	try {
		return useQuery(['data', path, query], fetchData);
	} catch (error) {
		throw new Error("Can't fetch data");
	}
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
		fetchDataPaginated
	);
};

export const useFetchDataFiltered = (path: string, query: Object) => {
	return useQuery(['data', path, query], fetchDataFiltered);
};
