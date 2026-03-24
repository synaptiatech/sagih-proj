import * as yup from 'yup';

export interface CompraType {
	codigo?: number;
	serie: string;
	tipo_transaccion: string;
	documento: number;
	fecha: string;
	descripcion: string;
	total: number;
	iva: number;
	proveedor: number;
	nombre: string;
	direccion: string;
	telefono: string;
	nit: string;
}

export const schemaCompra = yup.object().shape({
	fecha: yup.string().required('Fecha es requerido'),
	proveedor: yup.number().required('Proveedor es requerido'),
	descripcion: yup
		.string()
		.required('Descripcion es requerido')
		.max(128, 'Descripción debe tener máximo 128 caracteres'),
	total: yup
		.number()
		.required('Total es requerido')
		.positive('Total debe ser mayor a 0'),
	iva: yup.string().required('IVA es requerido'),
});
