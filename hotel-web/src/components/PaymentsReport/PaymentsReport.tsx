import React, { FormEvent, useEffect, useState } from 'react';
import { URI } from '../../consts/Uri';
import { reporteReducerTypes } from '../../hooks/reporteReducer';
import { useFetch } from '../../hooks/useFetch';
import FormReporte from '../form/FormReporte';
import { formatDateToInput } from '../../utils/Formateo';

export type PaymentsReportProps = {
	state: any;
	dispatch: any;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
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
				str_det_fecha: 'FECHA',
				str_monto: 'PAGO',
			},
		});
	};

	const setQueryFiltro = () => {
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
					valor: formatDateToInput({
						date: new Date(),
						setDay: 1,
					}),
				},
				{
					nombre: 'y',
					relacion: '<=',
					columna: 'det_fecha',
					valores: [],
					valor: formatDateToInput({
						date: new Date(),
					}),
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
		<>
			<FormReporte
				state={state}
				dispatch={dispatch}
				handleSubmit={handleSubmit}
			/>
		</>
	);
};

export default PaymentsReport;
