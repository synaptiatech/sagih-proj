import { createContext, useReducer } from 'react';
import {
	reporteDefault,
	reporteReducer,
	reporteState,
} from '../hooks/reporteReducer';

export interface ReporteContextProps {
	state: reporteState;
	dispatch: React.Dispatch<any>;
}

export const ReporteContext = createContext<ReporteContextProps>(
	{} as ReporteContextProps
);

const ReporteProvider = ({
	children,
}: {
	children: JSX.Element | JSX.Element[];
}) => {
	const [state, dispatch] = useReducer(
		reporteReducer,
		reporteDefault as never
	);

	return (
		<ReporteContext.Provider value={{ state, dispatch }}>
			{children}
		</ReporteContext.Provider>
	);
};

export default ReporteProvider;
