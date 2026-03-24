export interface CustomWhereProp {
	column: string;
	operator: string;
	value: string | number;
}

export interface UseFetchProp {
	path: string;
	table?: string;
	columns?: Record<string, string>;
	query?: Record<string, string | number>;
	sort?: Record<string, 'ASC' | 'DESC'>;
	limit?: number;
	offset?: number;
	q?: string;
	pageNumber?: number;
	pageSize?: number;
	customWhere?: CustomWhereProp[];
}
