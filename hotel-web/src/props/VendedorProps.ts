import * as yup from 'yup';
import { dataState } from '../hooks/dataReducer';

export interface VendedorProps {
	state: dataState;
	dispatch: React.Dispatch<any>;
	open: boolean;
	onClose: () => void;
}

export type VendedorType = {
	codigo: number;
	nombre: string;
	descripcion: string;
	comision_venta: string;
};

export const schemaVendedor = yup.object().shape({
	nombre: yup
		.string()
		.required('El nombre es requerido')
		.max(45, 'La cantidad máxima de caracteres es 45'),
	descripcion: yup
		.string()
		.required('La descripción es requerida')
		.max(45, 'La cantidad máxima de caracteres es 45'),
	comision_venta: yup
		.string()
		.required('La comisión es requerida')
		.max(45, 'La cantidad máxima de caracteres es 45'),
});
