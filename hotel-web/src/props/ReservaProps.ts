import * as yup from 'yup';
import { transactState } from '../hooks/transactReducer';

export interface TransactProps {
	state: transactState;
	dispatch: React.Dispatch<any>;
	open: boolean;
	onClose: () => void;
}

export type TranDetalleType = {
	codigo?: number;
	serie: string;
	tipo_transaccion: string;
	documento: number;
	descripcion: string;
	habitacion: number;
	servicio: number;
	precio: number | string;
	cantidad: number;
	subtotal: number;
	h_nombre?: string;
	s_nombre?: string;
};

export type TranEncabezadoType = {
	serie: string;
	tipo_transaccion: string;
	documento: number;
	fecha: Date;
	referencia: string;
	fecha_ingreso: string;
	hora_ingreso: string;
	fecha_salida: string;
	hora_salida: string;
	subtotal: number;
	total: number;
	saldo: number;
	abono?: number;
	numero_personas: number;
	estado: number;
	nombre_factura: string;
	nit_factura: string;
	direccion_factura: string;
	cliente: number;
	nombre_cliente?: string;
	telefono_cliente?: number;
	vendedor: number;
	nombre_vendedor?: string;
	iva: number;
	inguat: number;
	tipo_cambio: number;
	detalle: TranDetalleType[];
};

export const tranEncDefault: TranEncabezadoType = {
	serie: '',
	tipo_transaccion: '',
	documento: 0,
	fecha: new Date(),
	referencia: '',
	fecha_ingreso: '',
	hora_ingreso: '',
	fecha_salida: '',
	hora_salida: '',
	subtotal: 0,
	total: 0,
	saldo: 0,
	abono: 0,
	numero_personas: 0,
	estado: 0,
	nombre_factura: '',
	nit_factura: '',
	direccion_factura: '',
	cliente: 0,
	nombre_cliente: '',
	telefono_cliente: 0,
	vendedor: 0,
	nombre_vendedor: '',
	iva: 0,
	inguat: 0,
	tipo_cambio: 0,
	detalle: [],
};

/**
 *
 * @param date Fecha en formato ISOString
 * @returns Fecha formateada 'yyyy/mm/dd'
 */
export const formatFecha = (date: Date): string[] => {
	let fecha = new Date(date);
	let diaStr = fecha.getDate().toString();
	diaStr = +diaStr < 10 ? `0${diaStr}` : diaStr;
	let mesStr = (fecha.getMonth() + 1).toString();
	mesStr = +mesStr < 10 ? `0${mesStr}` : mesStr;
	let anio = fecha.getFullYear();
	let horaStr = fecha.getHours().toString();
	let minStr = fecha.getMinutes().toString();
	horaStr = +horaStr < 10 ? `0${horaStr}` : horaStr;
	minStr = +minStr < 10 ? `0${minStr}` : minStr;
	return [`${anio}-${mesStr}-${diaStr}`, `${horaStr}:${minStr}`];
};

/**
 * Sumar dias a una fecha
 * @param string Fecha a sumarle los dias
 * @param dia Días a sumar
 * @returns Fecha resultante
 */
export const sumarDia = (date: Date, dia: number): Date => {
	let fecha = new Date(date);
	fecha.setDate(fecha.getDate() + dia);
	return fecha;
};

/**
 * Crear una fecha con la hora definida
 * @param hora Hora a definir
 * @param minutos Minutos a definir
 * @param segundos Segundos a definir
 * @returns Fecha con la hora definida
 */
export const definirHora = (
	hora: number,
	minutos: number,
	segundos: number
): Date => {
	let fecha = new Date();
	fecha.setHours(hora);
	fecha.setMinutes(minutos);
	fecha.setSeconds(segundos);
	return fecha;
};

/**
 * Unir fecha y hora
 * @param fecha Fecha en formato ISOString
 * @param hora Hora en formato ISOString
 * @returns Fecha con la hora definida
 */
export const unirFechaHora = (fecha: Date, hora: Date): Date => {
	let fechaDate = new Date(fecha);
	let horaDate = new Date(hora);
	fechaDate.setHours(horaDate.getHours());
	fechaDate.setMinutes(horaDate.getMinutes());
	fechaDate.setSeconds(horaDate.getSeconds());
	return fechaDate;
};

export const schemaReserva = yup.object().shape({
	fecha_ingreso: yup
		.date()
		.required('Fecha de ingreso es requerido')
		.min(
			sumarDia(new Date(), -1),
			'Fecha de ingreso debe ser mayor a la fecha actual'
		)
		.typeError('Fecha de ingreso es requerido'),
	fecha_salida: yup
		.date()
		.required('Fecha salida es requerido')
		.min(
			yup.ref('fecha_ingreso'),
			'Fecha salida debe ser mayor o igual a la fecha de ingreso'
		),
	numero_personas: yup
		.number()
		.required('Numero de personas es requerido')
		.positive('Numero personas debe ser mayor a 0'),
	tipo_cambio: yup.number().required('Tipo de cambio es requerido'),
	vendedor: yup.number().optional(),
});

export const schemaEditReserva = yup.object().shape({
	fecha_ingreso: yup.date().required('Fecha de ingreso es requerido'),
	fecha_salida: yup
		.date()
		.required('Fecha salida es requerido')
		.min(
			yup.ref('fecha_ingreso'),
			'Fecha salida debe ser mayor o igual a la fecha de ingreso'
		),
	numero_personas: yup
		.number()
		.required('Numero de personas es requerido')
		.positive('Numero personas debe ser mayor a 0'),
	tipo_cambio: yup.number().required('Tipo de cambio es requerido'),
	vendedor: yup.number().optional(),
});
