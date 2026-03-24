import { PermisoType } from '../props/PermisoType';

enum authActionType {
	LOGUP = 'LOGUP',
	LOGIN = 'LOGIN',
	LOGOUT = 'LOGOUT',
	INIT_LOADING = 'INIT_LOADING',
	STOP_LOADING = 'STOP_LOADING',
}

interface authAction {
	type: authActionType;
	payload: any;
}

export interface authState {
	login: boolean;
	token: string;
	data: {
		usuario: string;
		correo: string;
		perfil: number;
	};
	permisos: PermisoType[];
	loading: boolean;
}

const authStateDefault = {
	login: false,
	token: '',
	data: {},
	permisos: [],
};

const authReducer = (state: authState, action: authAction) => {
	const { type, payload } = action;

	switch (type) {
		case authActionType.LOGUP:
			return {
				...state,
				...payload,
			};
		case authActionType.LOGIN:
			return { ...state, ...payload };
		case authActionType.LOGOUT:
			return authStateDefault;
		case authActionType.INIT_LOADING:
			return {
				...state,
				loading: true,
			};
		case authActionType.STOP_LOADING:
			return {
				...state,
				loading: false,
			};
		default:
			return state;
	}
};

export { authReducer, authActionType, authStateDefault };
