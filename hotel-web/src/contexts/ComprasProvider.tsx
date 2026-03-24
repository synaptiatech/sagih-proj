import { createContext, useReducer } from 'react';
import {
	comprasState,
	comprasReducer,
	comprasDefault,
} from '../hooks/correlativoReducer';

export interface ComprasContextProps {
	state: comprasState;
	dispatch: React.Dispatch<any>;
}

export const ComprasContext = createContext<ComprasContextProps>({
	state: comprasDefault,
	dispatch: () => null,
});

const ComprasProvider = ({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) => {
	const [state, dispatch] = useReducer(
		comprasReducer,
		comprasDefault as never
	);

	return (
		<ComprasContext.Provider value={{ state, dispatch }}>
			{children}
		</ComprasContext.Provider>
	);
};

export default ComprasProvider;
