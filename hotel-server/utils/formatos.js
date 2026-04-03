import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const APP_TIMEZONE = 'America/Guatemala';
export const DB_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const INPUT_TIMESTAMP_FORMAT = 'YYYY-MM-DDTHH:mm';
export const INPUT_TIMESTAMP_WITH_SECONDS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const API_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DATE_ONLY_FORMAT = 'YYYY-MM-DD';

/**
 * Formatear fecha para insertar en postgresql yyyy-mm-dd hh:mm:ss (24h)
 * @param {string} date Fecha en formato dd-mm-yyyy hh:mm:ss
 * @returns {string}
 */
export const switchDateToEng = (date) => {
	const separatedDate = date.includes('/') ? '/' : '-';
	const [fecha, hora] = date.split(' ');
	const [dia, mes, anio] = fecha.split(separatedDate);
	return `${anio}-${mes}-${dia} ${hora}`;
};

/**
 * Crear fecha a partir de un string
 * @param {string} strDate Fecha en formato dd-mm-yyyy hh:mm:ss
 * @returns {string}
 */
export const dateToPostgresTimestamp = (strDate) => {
	const separatedDate = strDate.includes('/') ? '/' : '-';
	const [fecha, hora] = strDate.split(' ');
	const [dia, mes, anio] = fecha.split(separatedDate);
	const [horas, minutos, segundos] = hora.split(':');
	return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
};

/**
 * Fecha larga en Guatemala
 * @param {Date} date
 */
export const formatDate = (date = new Date()) => {
	return new Intl.DateTimeFormat('es-GT', {
		dateStyle: 'long',
		timeZone: APP_TIMEZONE,
	}).format(date);
};

/**
 * Hora larga en Guatemala
 * @param {Date} date
 * @returns {string}
 */
export const formatTime = (date = new Date()) => {
	return new Intl.DateTimeFormat('es-GT', {
		timeStyle: 'medium',
		timeZone: APP_TIMEZONE,
	}).format(date);
};

/**
 * Formatea fecha y hora para PostgreSQL
 * @param {string} fecha Fecha en formato yyyy-mm-dd
 * @param {string} hora Hora en formato hh:mm
 * @returns {string}
 */
export const formatearFecha = (fecha, hora) => {
	const fechaLimpia = `${fecha || ''}`.trim();
	const horaLimpia = `${hora || ''}`.trim();

	if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
		throw new Error(`Fecha inválida: ${fechaLimpia}`);
	}

	if (!/^\d{2}:\d{2}$/.test(horaLimpia)) {
		throw new Error(`Hora inválida: ${horaLimpia}`);
	}

	return `${fechaLimpia} ${horaLimpia}:00`;
};

/**
 * Devuelve "ahora" en hora de Guatemala para guardar en BD
 * @returns {string}
 */
export const getGuatemalaTimestamp = () => {
	return dayjs().tz(APP_TIMEZONE).format(DB_TIMESTAMP_FORMAT);
};

/**
 * Convierte Date válido a timestamp Guatemala
 * @param {Date} value
 * @returns {string}
 */
const fromDateObject = (value) => {
	const parsed = dayjs(value);
	if (!parsed.isValid()) return getGuatemalaTimestamp();
	return parsed.tz(APP_TIMEZONE).format(DB_TIMESTAMP_FORMAT);
};

/**
 * Normaliza strings aceptados al formato YYYY-MM-DD HH:mm:ss
 * Acepta:
 * - YYYY-MM-DD HH:mm:ss
 * - YYYY-MM-DDTHH:mm
 * - YYYY-MM-DDTHH:mm:ss
 * - YYYY-MM-DD
 * - ISO con Z u offset
 *
 * @param {string} value
 * @returns {string}
 */
const normalizeStringTimestamp = (value) => {
	const cleanValue = value.trim();

	if (
		cleanValue === '' ||
		cleanValue.toLowerCase() === 'undefined' ||
		cleanValue.toLowerCase() === 'null' ||
		cleanValue.toLowerCase() === 'invalid date'
	) {
		return getGuatemalaTimestamp();
	}

	// 1) Ya viene en formato BD
	if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(cleanValue)) {
		return cleanValue;
	}

	// 2) datetime-local sin segundos
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cleanValue)) {
		return `${cleanValue.replace('T', ' ')}:00`;
	}

	// 3) datetime-local con segundos
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(cleanValue)) {
		return cleanValue.replace('T', ' ');
	}

	// 4) solo fecha
	if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
		return `${cleanValue} 00:00:00`;
	}

	// 5) ISO con timezone explícito
	if (/[zZ]$/.test(cleanValue) || /[+-]\d{2}:\d{2}$/.test(cleanValue)) {
		const parsed = dayjs(cleanValue);
		if (parsed.isValid()) {
			return parsed.tz(APP_TIMEZONE).format(DB_TIMESTAMP_FORMAT);
		}
	}

	// 6) Intento final con Date nativo si fuera un formato ISO raro pero válido
	const nativeDate = new Date(cleanValue);
	if (!Number.isNaN(nativeDate.getTime())) {
		return fromDateObject(nativeDate);
	}

	return getGuatemalaTimestamp();
};

/**
 * Convierte un valor a timestamp PostgreSQL en hora Guatemala
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export const toGuatemalaTimestamp = (value) => {
	if (value === undefined || value === null) {
		return getGuatemalaTimestamp();
	}

	if (value instanceof Date) {
		return fromDateObject(value);
	}

	if (typeof value === 'string') {
		return normalizeStringTimestamp(value);
	}

	return getGuatemalaTimestamp();
};
