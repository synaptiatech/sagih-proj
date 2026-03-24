import * as yup from 'yup';
import { comprasState } from '../hooks/correlativoReducer';

export interface CorrelativoProps {
	state: comprasState;
	dispatch: React.Dispatch<any>;
}

export type CorrelativoType = {
	serie: string;
	tipo_transaccion: string;
	siguiente?: number;
	documento?: number;
};

export const schemaCorrelativo = yup.object().shape({
	serie: yup
		.string()
		.required('Serie es requerida')
		.max(3, 'Serie debe tener máximo 3 caracteres'),
	tipo_transaccion: yup
		.string()
		.required('Tipo de transacción es requerido')
		.max(2, 'Tipo de transacción debe tener máximo 2 caracteres'),
	siguiente: yup
		.number()
		.required('Siguiente es requerido')
		.positive('Siguiente debe ser mayor a 0'),
});
