import * as yup from 'yup';

export interface ClienteProps {
	cliente: ClienteType | null;
	setCliente: (cliente: ClienteType) => void;
	onClose: () => void;
	onDelete?: (cliente: any) => void;
}

export interface ClienteType {
	codigo: number;
	nombre: string;
	nombre_c: string;
	nombre_factura: string;
	nit: string;
	nit_factura: string;
	direccion: string;
	direccion_factura: string;
	telefono_celular: number;
	telefono_casa: number;
	tipo_cliente: string;
	dpi: string;
	no_pasaporte: string;
	profesion: string;
	cedula: string;
	estado_civil: string;
	pais_origen: number;
	po_nombre: string;
	extendido_en: number;
	e_nombre: string;
}

export interface TClientEntity {
	codigo: number;
	nombre: string;
	nombre_c: string;
	nombre_factura: string;
	nit: string;
	nit_factura: string;
	direccion: string;
	direccion_factura: string;
	telefono_celular: number;
	telefono_casa: number;
	tipo_cliente: string;
	dpi: string;
	no_pasaporte: any;
	profesion: any;
	cedula: any;
	estado_civil: any;
	pais_origen: number;
	extendido_en: any;
	saldo: string;
}

export const schemaCliente = yup.object().shape({
	nombre: yup
		.string()
		.required('Nombre es requerido')
		.max(60, 'Máximo 60 caracteres'),
	nombre_c: yup.string().optional().max(60, 'Máximo 60 caracteres'),
	nit: yup
		.string()
		.test(
			'isNit',
			'Nit debe ser números, un guión (opcional) y un número o letra al final o CF',
			(value) =>
				value?.toLowerCase() === 'cf'
					? true
					: value !== ''
					? /(^[0-9]+[-]?([0-9]|['k']))$/.test(
							value?.toLowerCase() || ''
					  )
					: true
		)
		.optional(),
	nit_factura: yup
		.string()
		.test(
			'isNit',
			'Nit debe ser números, un guión (opcional) y un número o letra al final',
			(value) =>
				value !== ''
					? /^[0-9]+[-]?([0-9]|[A-Z])$/.test(value || '')
					: true
		)
		.optional(),
	direccion: yup.string().optional().max(100, 'Máximo 100 caracteres'),
	direccion_factura: yup
		.string()
		.optional()
		.max(100, 'Máximo 100 caracteres'),
	telefono_celular: yup.number().required('Teléfono celular es requerido'),
	telefono_casa: yup.number().required('Teléfono de casa es requerido'),
	tipo_cliente: yup.string().max(2, 'Máximo 2 caracteres'),
	dpi: yup
		.string()
		.test(
			'isDPI',
			'El formato del dpi es incorrecto: 0000000000000',
			(value) => (value !== '' ? /^[0-9]{13}$/.test(value || '') : true)
		)
		.max(15, 'Máximo 15 caracteres')
		.optional(),
	no_pasaporte: yup.string().max(15, 'Máximo 15 caracteres').optional(),
	profesion: yup.string().max(30, 'Máximo 30 caracteres').optional(),
	cedula: yup.string().max(15, 'Máximo 15 caracteres').optional(),
	estado_civil: yup.string().max(10, 'Máximo 10 caracteres').optional(),
	pais_origen: yup
		.number()
		.required('Pais es requerido')
		.positive('Pais debe ser seleccionado'),
	extendido_en: yup.number().optional(),
});
