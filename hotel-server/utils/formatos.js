import dayjs from 'dayjs';

/**
 * Formatear fecha para insertar en postgresql yyyy-mm-dd hh:mm:ss (24h)
 * @param {string} date Fecha en formato dd-mm-yyyy hh:mm:ss (25/7/2023 00:22:00) a formatear
 * @returns Fecha formateada
 */
export const switchDateToEng = (date) => {
	const separatedDate = date.includes('/') ? '/' : '-';
	const [fecha, hora] = date.split(' ');
	const [dia, mes, anio] = fecha.split(separatedDate);
	const res = `${anio}-${mes}-${dia} ${hora}`;
	console.log(date, res);
	return res;
};

/**
 * Crear fecha a partir de un string
 * @param {string} strDate Fecha en formato dd-mm-yyyy hh:mm:ss a formatear
 * @returns {string} Fecha formateada
 */
export const dateToPostgresTimestamp = (strDate) => {
	const separatedDate = strDate.includes('/') ? '/' : '-';
	const [fecha, hora] = strDate.split(' ');
	const [dia, mes, anio] = fecha.split(separatedDate);
	const [horas, minutos, segundos] = hora.split(':');
	const newDate = new Date(anio, mes, dia, horas, minutos, segundos);
	const timestamp = newDate
		.toISOString()
		.replace('T', ' ')
		.replace('Z', '000-06');
	console.log(anio, mes, dia, horas, minutos, segundos, newDate, timestamp);
	return timestamp;
};

/**
 * Formatear fecha a weekend, dd MMMM yyyy
 * @param {Date} date Fecha a formatear
 */
export const formatDate = (date = new Date()) => {
	const str = new Intl.DateTimeFormat('es-GT', {
		dateStyle: 'long',
		timeZone: 'America/Guatemala',
	}).format(date);

	console.log(str);
	return str;
};

/**
 * Formatear hora a hh:mm AM/PM
 * @param {Date} date Hora a formatear
 * @returns Hora formateada
 */
export const formatTime = (date = new Date()) => {
	const str = new Intl.DateTimeFormat('es-GT', {
		timeStyle: 'medium',
		timeZone: 'America/Guatemala',
	}).format(date);
	console.log(str);
	return str;
};

/**
 * Formatea la fecha y hora para ser guardada en la base de datos postgresql
 * @param {string} fecha Fecha en formato yyyy-mm-dd
 * @param {string} hora Hora en formtato hh:mm
 * @returns {string} Fecha y hora en formato timestamp de postgresql
 */
export const formatearFecha = (fecha, hora) => {
	let date = dayjs(`${fecha} ${hora}`, 'YYYY-MM-DD HH:mm');
	return date.format('YYYY-MM-DD HH:mm:ss');
};

/**
 * Obtiene timestamp en hora local de Guatemala
 * @returns {string} Fecha y hora en formato YYYY-MM-DD HH:mm:ss
 */
export const getGuatemalaTimestamp = () => {
	const parts = new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'America/Guatemala',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).formatToParts(new Date());

	const values = {};
	for (const part of parts) {
		if (part.type !== 'literal') {
			values[part.type] = part.value;
		}
	}

	return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
};
