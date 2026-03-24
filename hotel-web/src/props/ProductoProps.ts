import * as yup from 'yup';

export interface ProveedorProps {
	proveedor: ProveedorType | null;
	onClose: () => void;
}
export interface ProveedorType {
	codigo: number;
	nombre: string;
	direccion: string;
	telefono: string;
	nit: string;
}
export const defaultProveedor: ProveedorType = {
	codigo: 0,
	nombre: '',
	direccion: '',
	telefono: '',
	nit: '',
};

export const schemaProveedor = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(30, 'Máximo 30 caracteres'),
	direccion: yup
		.string()
		.required('Direccion es requerida')
		.max(100, 'Máximo 100 caracteres'),
	telefono: yup
		.string()
		.required('Telefono es requerido')
		.max(100, 'Máximo 8 caracteres'),
	nit: yup
		.string()
		.required('Nit es requerido')
		.test(
			'isNit',
			'Nit debe ser números, un guión (opcional) y un número o letra al final',
			(value) => /^[0-9]+[-]?([0-9]|[A-Z])$/.test(value || '')
		),
});
