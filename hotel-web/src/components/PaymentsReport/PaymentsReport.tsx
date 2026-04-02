import React, { FormEvent, useEffect } from 'react';
import { reporteReducerTypes } from '../../hooks/reporteReducer';
import FormReporte from '../form/FormReporte';

export type PaymentsReportProps = {
	state: any;
	dispatch: any;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const pad2 = (value: number) => String(value).padStart(2, '0');

const formatDateTimeLocal = (date: Date) => {
	return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
		date.getDate()
	)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(
		date.getSeconds()
	)}`;
};

const PaymentsReport: React.FC<PaymentsReportProps> = ({
	state,
	dispatch,
	handleSubmit,
}) => {
	const setColumns = () => {
		dispatch({
			type: reporteReducerTypes.UPDATE_COLS_REPORTE,
			payload: {
				doc: 'DOCUMENTO',
				det_fecha: 'FECHA Y HORA',
				str_monto: 'PAGO',
			},
		});
	};

	const setQueryFiltro = () => {
		const now = new Date();
		const firstDay = new Date(now);
		firstDay.setDate(1);
		firstDay.setHours(0, 0, 0, 0);

		const endNow = new Date(now);
		endNow.setMilliseconds(0);

		dispatch({
			type: reporteReducerTypes.SET_QUERY_FILTRO,
			payload: [
				{
					nombre: 'Serie',
					relacion: '=',
					columna: 'serie',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Documento',
					relacion: '=',
					columna: 'documento',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Fecha de pago',
					relacion: '>=',
					columna: 'det_fecha',
					valores: [],
					valor: formatDateTimeLocal(firstDay),
				},
				{
					nombre: 'y',
					relacion: '<=',
					columna: 'det_fecha',
					valores: [],
					valor: formatDateTimeLocal(endNow),
				},
				{
					nombre: 'Monto',
					relacion: '>=',
					columna: 'monto',
					valores: [],
					valor: '',
				},
			],
		});
	};

	useEffect(() => {
		setColumns();
		setQueryFiltro();
	}, []);

	return (
		<FormReporte
			state={state}
			dispatch={dispatch}
			handleSubmit={handleSubmit}
		/>
	);
};

export default PaymentsReport;
