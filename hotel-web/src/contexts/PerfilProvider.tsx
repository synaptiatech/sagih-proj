import { createContext, useReducer } from 'react';
import {
	perfilDefault,
	perfilReducer,
	perfilState,
} from '../hooks/PerfilReducer';

export interface PerfilContextProps {
	state: perfilState;
	dispatch: React.Dispatch<any>;
}

export const PerfilContext = createContext<PerfilContextProps>({
	state: perfilDefault,
	dispatch: () => null,
});

const PerfilProvider = ({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) => {
	const [state, dispatch] = useReducer(perfilReducer, perfilDefault as never);

	return (
		<PerfilContext.Provider value={{ state, dispatch }}>
			{children}
		</PerfilContext.Provider>
	);
};

export default PerfilProvider;
