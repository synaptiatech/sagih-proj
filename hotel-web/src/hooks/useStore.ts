import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, DataUser, PermisoUser } from '../props/StoreProps';

type State = {
	token: string;
	data: DataUser;
	permisos: PermisoUser[];
};

type Actions = {
	setState: (state: AuthState) => void;
	isLogged: () => boolean;
	resetState: () => void;
};

export const useStore = create(
	persist<State & Actions>(
		(set, get) => ({
			token: '',
			data: {} as DataUser,
			permisos: [],
			setState: (state: AuthState) =>
				set({
					token: state.token,
					data: state.data,
					permisos: state.permisos,
				}),
			isLogged: () => {
				return get().token ? true : false;
			},
			resetState: () =>
				set({
					token: '',
					data: {} as DataUser,
					permisos: [],
				}),
		}),
		{
			name: 'SAGH',
		}
	)
);
