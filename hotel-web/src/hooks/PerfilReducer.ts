import { TiposType } from '../props/Tipos';

enum perfilTypes {
	SET_DATA = 'SET_DATA',
	SET_PERFIL = 'SET_PERFIL',
	SET_PERMISOS = 'SET_PERMISOS',
	RESET = 'RESET',
}

export interface perfilState {
	perfil: TiposType;
	permisos: Object[];
}

const perfilDefault: perfilState = {
	perfil: {} as TiposType,
	permisos: [],
};

interface perfilAction {
	type: perfilTypes;
	payload: any;
}

const perfilReducer = (state: perfilState, action: perfilAction) => {
	const { type, payload } = action;

	switch (type) {
		case perfilTypes.SET_DATA:
			return {
				...payload,
			};
		case perfilTypes.SET_PERFIL:
			return {
				...state,
				perfil: payload,
			};
		case perfilTypes.SET_PERMISOS:
			return {
				...state,
				permisos: payload,
			};
		case perfilTypes.RESET:
			return perfilDefault;
		default:
			return perfilDefault;
	}
};

export { perfilReducer, perfilTypes, perfilDefault };
