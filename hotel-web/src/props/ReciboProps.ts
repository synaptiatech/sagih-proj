import * as yup from 'yup';
import { transactState } from '../hooks/transactReducer';
import { formatDate, formatTime } from '../utils/Formateo';

export interface TransactProps {
	state: transactState;
	dispatch: React.Dispatch<any>;
	open: boolean;
	onClose: () => void;
}

export type RCDetType = {
	codigo?: number;
	serie: string;
	tipo_transaccion: string;
	documento: number;
	serie_fac: string;
	ti_tran_fac: string;
	documento_fac: number;
	descripcion: string;
	tipo_pago: number;
	n_tipo_pago: string;
	monto: number;
};

export const rcDetInit: RCDetType = {
	serie: '',
	tipo_transaccion: '',
	documento: 0,
	serie_fac: '',
	ti_tran_fac: '',
	documento_fac: 0,
	descripcion: '',
	tipo_pago: 0,
	n_tipo_pago: '',
	monto: 0,
};

export type RCEncType = {
	serie: string;
	tipo_transaccion: string;
	documento: number;
	cliente: number;
	cobrador: number;
	fecha: Date;
	abono: number;
	referencia: string;
	descripcion: string;
	detalle: RCDetType[];
};

export const rcEncInit: RCEncType = {
	serie: '',
	tipo_transaccion: '',
	documento: 0,
	cliente: 0,
	cobrador: 0,
	fecha: new Date(),
	abono: 0,
	referencia: '',
	descripcion: '',
	detalle: [],
};

/**
 *
 * @param date Fecha en formato ISOString
 * @returns Fecha formateada 'yyyy/mm/dd'
 */
export const formatFecha = (date: Date): string[] => {
	let fullDate = new Date(date);
	let fecha = formatDate(fullDate);
	let hora = formatTime(fullDate);
	return [fecha.replace('/', '-'), hora, `${fecha} ${hora}`];
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
	tipo_transaccion: yup.string().required('Tipo de transaccion es requerido'),
	fecha_ingreso: yup
		.date()
		.required('Fecha de ingreso es requerido')
		.min(
			sumarDia(new Date(), -2),
			'Fecha de ingreso debe ser mayor a la fecha actual'
		)
		.typeError('Fecha de ingreso es requerido'),
	fecha_salida: yup
		.date()
		.required('Fecha salida es requerido')
		.min(
			yup.ref('fecha_ingreso'),
			'Fecha salida debe ser mayor a la fecha de ingreso'
		),
	numero_personas: yup
		.number()
		.required('Numero de personas es requerido')
		.positive('Numero personas debe ser mayor a 0'),
	vendedor: yup.number().required('Vendedor es requerido'),
	tipo_cambio: yup.number().required('Tipo de cambio es requerido'),
});
