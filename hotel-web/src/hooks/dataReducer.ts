enum dataType {
	SET_DATA = 'SET_DATA',
	SET_CURRENT_PAGE = 'SET_CURRENT_PAGE',
	SET_METADATA = 'SET_METADATA',
	SET_FILTER = 'SET_FILTER',
	SET_SORT = 'SET_SORT',
	SET_SORTDIRECTION = 'SET_SORTDIRECTION',
}

const dataDefault = {
	data: null,
	count: 0,
	pages: 1,
	currentPage: 1,
	limit: 10,
	q: '',
};

export interface dataState {
	data: any | null;
	count: number;
	pages: number;
	currentPage: number;
	limit: number;
	q: string;
}

interface dataAction {
	type: dataType;
	payload: any;
}

const dataReducer = (state: dataState, action: dataAction) => {
	const { type, payload } = action;

	switch (type) {
		case dataType.SET_DATA:
			return {
				...state,
				tipo: payload,
			};
		case dataType.SET_CURRENT_PAGE:
			return {
				...state,
				currentPage: payload,
			};
		case dataType.SET_METADATA:
			return {
				...state,
				data: payload.rows,
				count: payload.count,
				pages: state.limit ? Math.ceil(payload.count / state.limit) : 1,
			};
		case dataType.SET_FILTER:
			return {
				...state,
				q: payload,
			};
		case dataType.SET_SORT:
			return {
				...state,
				sort: payload,
			};
		case dataType.SET_SORTDIRECTION:
			return {
				...state,
				sortDirection: payload,
			};
		default:
			return state;
	}
};

export { dataReducer, dataDefault, dataType };
