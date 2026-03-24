import { createContext, useReducer } from 'react';
import {
	transactDefault,
	transactReducer,
	transactState,
} from '../hooks/transactReducer';
import { TransactProps } from '../props/ReservaProps';
import { useStore } from '../hooks/useStore';
import { PermisoUser } from '../props/StoreProps';
import ErrorLayout from '../components/layout/error';
import { useLocation } from 'react-router-dom';

export interface TransactContextProps {
	state: transactState;
	dispatch: React.Dispatch<any>;
}

export const TransactContext = createContext<TransactContextProps>(
	{} as TransactProps
);

const TransactProvider = ({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) => {
	const { permisos } = useStore();
	const [state, dispatch] = useReducer(
		transactReducer,
		transactDefault as never
	);
	const location = useLocation();

	const condicion =
		location.pathname.split('/').pop() === 'perfil' ||
		permisos.find(
			(p: PermisoUser) => p.forma === location.pathname.split('/').pop()
		);

	if (!condicion) {
		console.log(location.pathname.split('/').pop() === 'perfil');
		return (
			<ErrorLayout
				error={
					'No tiene permisos o no hay una sesión activa. Inicie sesión para continuar.'
				}
			/>
		);
	}

	return (
		<TransactContext.Provider value={{ state, dispatch }}>
			{children}
		</TransactContext.Provider>
	);
};

export default TransactProvider;
