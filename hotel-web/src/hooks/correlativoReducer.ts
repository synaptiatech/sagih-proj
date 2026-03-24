import { CompraType } from '../props/CompraProps';
import { CorrelativoType } from '../props/CorrelativoProps';

enum comprasTypes {
	SET_DATA = 'SET_DATA',
	SET_CORRELATIVO = 'SET_CORRELATIVO',
	SET_COMPRAS = 'SET_COMPRAS',
	RESET = 'RESET',
}

export interface comprasState {
	correlativo: CorrelativoType;
	compras: CompraType;
}

const comprasDefault: comprasState = {
	correlativo: {} as CorrelativoType,
	compras: {} as CompraType,
};

interface comprasAction {
	type: comprasTypes;
	payload: any;
}

const comprasReducer = (state: comprasState, action: comprasAction) => {
	const { type, payload } = action;

	switch (type) {
		case comprasTypes.SET_DATA:
			return {
				...payload,
				correlativo: {
					serie: payload.compras.serie,
					tipo_transaccion: payload.compras.tipo_transaccion,
					siguiente: payload.compras.documento,
					documento: payload.compras.documento,
				},
			};
		case comprasTypes.SET_CORRELATIVO:
			return {
				...state,
				correlativo: { ...state.correlativo, ...payload },
			};
		case comprasTypes.SET_COMPRAS:
			return {
				...state,
				compras: { ...state.compras, ...payload },
			};
		case comprasTypes.RESET:
			return comprasDefault;
		default:
	}
};

export { comprasReducer, comprasTypes, comprasDefault };
