import { HTMLInputTypeAttribute, HtmlHTMLAttributes } from 'react';
import daysjs, { Dayjs } from 'dayjs';

export const formatearEstadoHabitacion = (estado: string) => {
	switch (estado) {
		case 'D':
			return 'Disponible';
		case 'O':
			return 'Ocupada';
		case 'RE':
			return 'Reservada';
		case 'N':
			return 'Mantenimiento';
		default:
			return 'Limpieza';
	}
};

export const toCapitalCase = (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const inputFormatValue = (
	type: HTMLInputTypeAttribute,
	value: string
) => {
	switch (type) {
		case 'number':
			return Number(value);
		case 'datetime-local':
			return value;
		case 'date':
			return value.split(' ')[0];
		case 'time':
			return value;
		case 'month':
			let strDate = value.split(' ')[0];
			let [year, month] = strDate.split('-');
			return `${year}-${month}`;
		default:
			return value;
	}
};

export const switchDateToEng = (date: string) => {
	const [day, month, year] = date.split('/');
	return `${year}-${month}-${day}`;
};

const switchFormatDate = (
	strDate: string,
	fromFormat: string,
	toFormat: string
) => {
	let date: Dayjs;
	if (fromFormat === 'postgres') {
		date = daysjs(strDate, 'YYYY-MM-DD');
	} else if (fromFormat === 'input') {
		date = daysjs(strDate, 'YYYY-MM-DD');
	} else {
		date = daysjs(strDate);
	}

	if (toFormat === 'postgres') {
		return date.format('YYYY-MM-DD');
	} else if (toFormat === 'input') {
		return date.format('YYYY-MM-DD');
	} else {
		return date.format('YYYY-MM-DD');
	}
};

const switchFormatTime = (
	strDate: string,
	fromFormat: string,
	toFormat: string
) => {
	let date: Dayjs;
	if (fromFormat === 'postgres') {
		date = daysjs(strDate, 'HH:mm:ss');
	} else if (fromFormat === 'input') {
		date = daysjs(strDate, 'HH:mm:ss');
	} else {
		date = daysjs(strDate);
	}

	if (toFormat === 'postgres') {
		return date.format('HH:mm:ss');
	} else if (toFormat === 'input') {
		return date.format('HH:mm:ss');
	} else {
		return date.format('HH:mm:ss');
	}
};

/**
 * Switch the format of a timestamp string date from one format to another
 * @param strTimestamp Date in string format
 * @param fromFormat postgres | input | Date
 * @param toFormat postgres | input | Date
 */
const switchFormatTimestamp = (
	strTimestamp: string,
	fromFormat: string,
	toFormat: string
) => {
	let date: string = '';

	if (fromFormat === 'mysql') {
		let arrTimestamp = strTimestamp.split('T');
		let strDate = switchFormatDate(arrTimestamp[0], fromFormat, toFormat);
		let strTime = switchFormatTime(arrTimestamp[1], fromFormat, toFormat);
	}
};

export const formatToDateTime = (
	date: Date,
	addBeginHour: boolean = false,
	incrementMinute = false
) => {
	if (addBeginHour) date.setHours(8, 0);
	if (incrementMinute) date.setMinutes(date.getMinutes() + 1);
	return daysjs(date).format('YYYY-MM-DD HH:mm:ss');
};

export const formatDateToInput = ({
	date,
	setDay = 0,
	setHour = 0,
	setMinute = 0,
	onlyTime = false,
	onlyMonth = false,
}: {
	date: Date;
	setDay?: number;
	setHour?: number;
	setMinute?: number;
	onlyTime?: boolean;
	onlyMonth?: boolean;
}) => {
	if (setDay) date.setDate(setDay);
	if (setHour) date.setHours(setHour, 0, 0, 0);
	if (setMinute) date.setMinutes(setMinute, 0, 0);

	if (onlyTime) return daysjs(date).format('HH:mm');
	if (onlyMonth) return daysjs(date).format('YYYY-MM');
	return daysjs(date).format('YYYY-MM-DD HH:mm');
};

export const formatDate = (date: Date) => {
	return date.toLocaleDateString('es-GT', {
		dateStyle: 'long',
		timeZone: 'America/Guatemala',
	});
};

export const formatTime = (date: Date) => {
	return date.toLocaleTimeString('es-GT', {
		timeStyle: 'medium',
		timeZone: 'America/Guatemala',
	});
};

export const formatDateTime = (date: Date): string => {
	const datePart = new Intl.DateTimeFormat('es-GT', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'America/Guatemala',
	}).format(date);
	const timePart = new Intl.DateTimeFormat('es-GT', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
		timeZone: 'America/Guatemala',
	}).format(date);
	return `${datePart} ${timePart}`;
};

export const calcularDias = (dia_1: Date, dia_2: Date): number => {
	let diferencia = dia_2.getTime() - dia_1.getTime();
	return Math.round(diferencia / (1000 * 3600 * 24));
};
