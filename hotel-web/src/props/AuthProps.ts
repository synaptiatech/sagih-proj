import { AuthState } from './StoreProps';

export interface AuthProviderProps {
	children: JSX.Element | JSX.Element[];
}

export type AuthContextPops = {
	state: AuthState;
	dispatch: React.Dispatch<any>;
};
