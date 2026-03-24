import * as yup from 'yup';

export type CierreType = {
	openingDate: string;
	shiftClose: string;
	actualClose: string;
};

export const schemaCierre = yup.object().shape({
	openingDate: yup.date().required('La fecha de apertura es requerida'),
	shiftClose: yup
		.date()
		.required('La fecha de cierre es requerida')
		.min(
			yup.ref('openingDate'),
			'La fecha de cierre debe ser mayor a la fecha de apertura'
		)
		.max(
			yup.ref('actualClose'),
			'La fecha de cierre debe ser menor a la fecha actual'
		),
	actualClose: yup.date().required('La fecha de cierre es requerida'),
});
