import * as yup from 'yup';

export interface DepartamentoProps {
	departamento: DepartamentoType | null;
	onClose: () => void;
}

export interface DepartamentoType {
	codigo: number;
	nombre: string;
	descripcion: string;
	pais: number;
}

export const schemaDepartamento = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(30, 'Máximo 30 caracteres'),
	descripcion: yup
		.string()
		.required('Descripcion es requerido')
		.max(50, 'Máximo 50 caracteres'),
	pais: yup
		.number()
		.required('País es requerido')
		.positive('País es requerido'),
});
