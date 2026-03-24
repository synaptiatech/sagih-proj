import * as yup from 'yup';

export interface PaisProps {
	pais: PaisType | null;
	onClose: () => void;
}

export interface PaisType {
	codigo: number;
	nombre: string;
	iso2: string;
	descripcion: string;
}

export const schemaPais = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(50, 'Máximo 50 caracteres'),
	iso2: yup
		.string()
		.required('Iso2 es requerido')
		.max(10, 'Máximo 10 caracteres'),
	descripcion: yup
		.string()
		.required('Descripcion es requerido')
		.max(100, 'Máximo 100 caracteres'),
});
