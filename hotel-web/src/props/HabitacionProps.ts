import * as yup from 'yup';
export interface HabitacionProps {
	habitacion: HabitacionType | null;
	onClose: () => void;
}

export type HabitacionType = {
	codigo?: number;
	nombre: string;
	descripcion: string;
	precio: number;
	estado: string;
	nivel: number;
	area: number;
	tipo: number;
	n_nombre?: string;
	a_nombre?: string;
	th_nombre?: string;
};

export type EstadoType = {
	codigo: string;
	name: string;
};

export const schemaHabitacion = yup.object().shape({
	nombre: yup
		.number()
		.required('Nombre es requerido')
		.typeError('El nombre debe ser numerico'),
	descripcion: yup
		.string()
		.required('Descripcion es requerido')
		.max(100, 'Máximo 50 caracteres'),
	precio: yup
		.number()
		.required('El precio es requerido')
		.typeError('El precio debe ser numerico')
		.positive('El precio debe ser positivo'),
	nivel: yup
		.number()
		.required('El nivel de es requerido')
		.positive('El nivel debe ser seleccionada de nuevo'),
	area: yup
		.number()
		.required('El area de es requerido')
		.positive('El area debe ser seleccionada de nuevo'),
	tipo: yup
		.number()
		.required('El tipo de habitación de es requerido')
		.positive('El tipo de habitación debe ser seleccionada de nuevo'),
});
