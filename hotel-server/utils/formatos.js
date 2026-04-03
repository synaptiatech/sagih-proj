import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(customParseFormat);
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
	const parsed = dayjs.tz(
		`${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`,
		DB_TIMESTAMP_FORMAT,
		APP_TIMEZONE
	);
	return parsed.format(DB_TIMESTAMP_FORMAT);
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
	return dayjs
		.tz(`${fecha} ${hora}`, 'YYYY-MM-DD HH:mm', APP_TIMEZONE)
		.format(DB_TIMESTAMP_FORMAT);
};

/**
 * Devuelve "ahora" en hora de Guatemala para guardar en BD
 * @returns {string}
 */
export const getGuatemalaTimestamp = () => {
	return dayjs().tz(APP_TIMEZONE).format(DB_TIMESTAMP_FORMAT);
};

/**
 * Convierte un valor ISO con zona horaria explícita a Guatemala
 * @param {string} value
 * @returns {string|null}
 */
const parseIsoWithTimezone = (value) => {
	const hasExplicitTimezone =
		typeof value === 'string' &&
		(/[zZ]$/.test(value) || /[+-]\d{2}:\d{2}$/.test(value));

	if (!hasExplicitTimezone) return null;

	const parsed = dayjs(value);
	if (!parsed.isValid()) return null;

	return parsed.tz(APP_TIMEZONE).format(DB_TIMESTAMP_FORMAT);
};

/**
 * Convierte un valor a timestamp PostgreSQL en hora Guatemala.
 * Acepta únicamente formatos controlados para evitar errores ambiguos.
 *
 * Acepta:
 * - YYYY-MM-DD HH:mm:ss
 * - YYYY-MM-DDTHH:mm
 * - YYYY-MM-DDTHH:mm:ss
 * - YYYY-MM-DD
 * - Date válido
 * - ISO con Z o con offset explícito
 *
 * @param {string|Date|null|undefined} value
 * @returns {string}
 */
export const toGuatemalaTimestamp = (value) => {
	if (value === undefined || value === null) {
		return getGuatemalaTimestamp();
	}

	if (value instanceof Date) {
		const parsedDate = dayjs(value);
		if (!parsedDate.isValid()) {
			throw new Error(`Fecha inválida recibida como Date: ${value}`);
		}
		return parsedDate.tz(APP_TIMEZONE).format(DB_TIMESTAMP_FORMAT);
	}

	if (typeof value === 'string') {
		const cleanValue = value.trim();

		if (cleanValue === '') {
			return getGuatemalaTimestamp();
		}

		const apiParsed = dayjs.tz(
			cleanValue,
			API_TIMESTAMP_FORMAT,
			APP_TIMEZONE,
			true
		);
		if (apiParsed.isValid()) {
			return apiParsed.format(DB_TIMESTAMP_FORMAT);
		}

		const inputParsed = dayjs.tz(
			cleanValue,
			INPUT_TIMESTAMP_FORMAT,
			APP_TIMEZONE,
			true
		);
		if (inputParsed.isValid()) {
			return inputParsed.format(DB_TIMESTAMP_FORMAT);
		}

		const inputWithSecondsParsed = dayjs.tz(
			cleanValue,
			INPUT_TIMESTAMP_WITH_SECONDS_FORMAT,
			APP_TIMEZONE,
			true
		);
		if (inputWithSecondsParsed.isValid()) {
			return inputWithSecondsParsed.format(DB_TIMESTAMP_FORMAT);
		}

		const dateOnlyParsed = dayjs.tz(
			cleanValue,
			DATE_ONLY_FORMAT,
			APP_TIMEZONE,
			true
		);
		if (dateOnlyParsed.isValid()) {
			return dateOnlyParsed.startOf('day').format(DB_TIMESTAMP_FORMAT);
		}

		const isoWithTimezone = parseIsoWithTimezone(cleanValue);
		if (isoWithTimezone) {
			return isoWithTimezone;
		}

		throw new Error(`Fecha inválida recibida: ${cleanValue}`);
	}

	throw new Error(`Tipo de fecha no soportado: ${typeof value}`);
};
