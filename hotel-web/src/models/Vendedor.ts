import * as yup from 'yup';

export interface VendedorType {
	codigo: number;
	nombre: string;
	descripcion: string;
	comision_venta: number;
}

export const vendedorDefault: VendedorType = {
	codigo: 0,
	nombre: '',
	descripcion: '',
	comision_venta: 0,
};

export const schemaVendedor = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(45, 'Máximo 45 caracteres'),
	descripcion: yup
		.string()
		.required('Descripción es requerida')
		.max(100, 'Máximo 100 caracteres'),
	comision_venta: yup
		.number()
		.notRequired()
		.min(0, 'Minimo 0%')
		.max(100, 'Máximo 100%'),
});
