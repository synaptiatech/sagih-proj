import * as yup from 'yup';

export interface EmpresaType {
	codigo?: number;
	nombre: string;
	direccion: string;
	telefono: string;
	nit: string;
	correo: string;
	logo: string;
}

export const schemaEmpresa = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(50, 'Máximo 50 caracteres'),
	direccion: yup
		.string()
		.required('Direccion es requerido')
		.max(100, 'Máximo 100 caracteres'),
	telefono: yup
		.string()
		.test('isNumber', 'Teléfono debe ser un número', (value) =>
			/^[0-9]+$/.test(value || '')
		)
		.required('Telefono es requerido')
		.max(8, 'Máximo 8 dígitos'),
	nit: yup
		.string()
		.required('Nit es requerido')
		.test(
			'isNit',
			'Nit debe ser números, un guión (opcional) y un número o letra al final',
			(value) => /^[0-9]+[-]?([0-9]|[A-Z])$/.test(value || '')
		),
	correo: yup
		.string()
		.required('Correo es requerido')
		.email('Correo no es válido')
		.max(100, 'Máximo 100 caracteres'),
});
