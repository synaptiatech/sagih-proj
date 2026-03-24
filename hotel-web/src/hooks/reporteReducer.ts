import { ReporteQueryType } from '../props/ReporteProps';

enum reporteReducerTypes {
	SET_QUERY_FILTRO = 'SET_QUERY_FILTRO',
	UPDATE_COLS_REPORTE = 'UPDATE_COLS_REPORTE',
	UPDATE_PARAMS_FILTRO = 'UPDATE_PARAMS_FILTRO',
	UPDATE_QUERY_VALOR = 'UPDATE_QUERY_VALOR',
	RESET = 'RESET',
}

const reporteDefault = {
	title: 'Reporte parametrizado',
	colsReporte: {},
	queryFiltro: [],
};

export interface reporteState {
	title: string;
	colsReporte: any;
	queryFiltro: ReporteQueryType[];
}

interface reporteAction {
	type: reporteReducerTypes;
	payload: any;
}

const reporteReducer = (state: reporteState, action: reporteAction) => {
	const { type, payload } = action;

	switch (type) {
		case reporteReducerTypes.SET_QUERY_FILTRO:
			return {
				...state,
				queryFiltro: payload,
			};
		case reporteReducerTypes.UPDATE_COLS_REPORTE:
			return {
				...state,
				colsReporte: payload,
			};
		case reporteReducerTypes.UPDATE_PARAMS_FILTRO:
			return {
				...state,
				paramsFiltro: payload,
			};
		case reporteReducerTypes.UPDATE_QUERY_VALOR:
			return {
				...state,
				queryFiltro: state.queryFiltro.map((q, index) => {
					if (index === payload.index) {
						return {
							...q,
							valor: payload.valor,
						};
					}
					return q;
				}),
			};
		case reporteReducerTypes.RESET:
			return {
				...reporteDefault,
			};
	}
};

export { reporteReducer, reporteReducerTypes, reporteDefault };
