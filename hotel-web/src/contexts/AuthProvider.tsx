import { createContext, useReducer } from 'react';
import { authReducer, authState, authStateDefault } from '../hooks/AuthReducer';

export interface AuthContextPops {
	state: authState;
	dispatch: React.Dispatch<any>;
}

export const AuthContext = createContext<AuthContextPops>(
	{} as AuthContextPops
);

export const AuthProvider = ({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) => {
	const [state, dispatch] = useReducer(
		authReducer,
		authStateDefault as never
	);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
