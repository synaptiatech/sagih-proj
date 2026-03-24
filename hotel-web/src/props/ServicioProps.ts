import * as yup from 'yup';

export interface ServicioProps {
	servicio: ServicioType | null;
	onClose: () => void;
}

export interface ServicioType {
	codigo: number;
	nombre: string;
	descripcion: string;
	precio_unitario: number;
	precio_mayorista: number;
	tipo: number;
	t_nombre?: string;
	t_descripcion?: string;
}

export const schemaServicio = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(30, 'Máximo 50 caracteres'),
	descripcion: yup
		.string()
		.required('Descripcion es requerido')
		.max(100, 'Máximo 50 caracteres'),
	precio_unitario: yup
		.number()
		.required('El precio es requerido')
		.typeError('El precio debe ser numerico')
		.positive('El precio debe ser positivo'),
	precio_mayorista: yup
		.number()
		.required('El precio es requerido')
		.typeError('El precio debe ser numerico')
		.positive('El precio debe ser positivo'),
	tipo: yup
		.number()
		.required('El tipo de es requerido')
		.min(0, 'El precio debe ser positivo'),
});
