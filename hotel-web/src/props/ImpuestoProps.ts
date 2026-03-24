import * as yup from 'yup';

export interface ImpuestoProps {
	impuesto: ImpuestoType | null;
	onClose: () => void;
}

export interface ImpuestoType {
	codigo: number;
	nombre: string;
	porcentaje: number;
}

export const schemaImpuesto = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.typeError('Nombre debe ser un texto')
		.max(50, 'Máximo 50 caracteres'),
	porcentaje: yup
		.number()
		.typeError('Porcentaje debe ser un número')
		.required('Porcentaje es requerido')
		.max(100, 'Porcentaje debe ser menor a 100')
		.positive('Porcentaje debe ser positivo'),
});
