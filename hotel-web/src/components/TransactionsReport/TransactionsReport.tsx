import React, { FormEvent, useEffect, useState } from 'react';
import { URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import { reporteReducerTypes } from '../../hooks/reporteReducer';
import FormReporte from '../form/FormReporte';
import { formatDateToInput } from '../../utils/Formateo';
import Loader from '../layout/loader';
import { Typography } from '@mui/material';

export type TransactionsReportProps = {
	state: any;
	dispatch: any;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const TransactionsReport: React.FC<TransactionsReportProps> = ({
	state,
	dispatch,
	handleSubmit,
}) => {
	const { data, isLoading, isError } = useFetch({
		path: `${URI.transaccion}/reportes`,
		table: 'v_reporte_transaccion',
	});

	const setColumns = () => {
		dispatch({
			type: reporteReducerTypes.UPDATE_COLS_REPORTE,
			payload: {
				documento: 'DOCUMENTO',
				fecha_ingreso: 'INGRESO',
				fecha_salida: 'SALIDA',
				n_habitacion: 'HAB',
				cliente: 'COD CLI',
				n_cliente: 'CLIENTE',
				n_vendedor: 'VENDEDOR',
				str_subtotal: 'SUBTOTAL',
				str_total: 'TOTAL',
				str_saldo: 'SALDO',
			},
		});
	};

	const setQueryFiltro = () => {
		const { clientes, vendedores, transacciones } = data;
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
					nombre: 'Transacción',
					relacion: '=',
					columna: 'tipo_transaccion',
					valores: transacciones.rows.map((t: any) => ({
						valor: t.nombre,
						id: t.codigo,
					})),
					valor: 'CI',
				},
				{
					nombre: 'Documento',
					relacion: '=',
					columna: 'doc',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Total',
					relacion: '>=',
					columna: 'total',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Fecha de ingreso',
					relacion: '>=',
					columna: 'dat_fecha_ingreso',
					valores: [],
					valor: formatDateToInput({
						date: new Date(),
						setDay: 1,
					}),
				},
				{
					nombre: 'y',
					relacion: '<=',
					columna: 'dat_fecha_ingreso',
					valores: [],
					valor: formatDateToInput({
						date: new Date(),
					}),
				},
				{
					nombre: 'Saldo',
					relacion: '>=',
					columna: 'saldo',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Fecha de salida',
					relacion: '>=',
					columna: 'dat_fecha_salida',
					valores: [],
					valor: '',
				},
				{
					nombre: 'y',
					relacion: '<=',
					columna: 'dat_fecha_salida',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Número de personas',
					relacion: '=',
					columna: 'numero_personas',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Clientes',
					relacion: '=',
					columna: 'cliente',
					valores: clientes.rows.map((c: any) => ({
						valor: `${c.codigo} ${c.nombre}`,
						id: c.codigo,
					})),
					valor: '',
				},
				{
					nombre: 'Cliente',
					relacion: '~~*',
					columna: 'n_cliente',
					valores: [],
					valor: '',
				},
				{
					nombre: 'Vendedor',
					relacion: '=',
					columna: 'vendedor',
					valores: vendedores.rows.map((v: any) => ({
						valor: `${v.codigo} ${v.nombre}`,
						id: v.codigo,
					})),
					valor: '',
				},
				{
					nombre: 'Vendedor',
					relacion: '~~*',
					columna: 'n_vendedor',
					valores: [],
					valor: '',
				},
			],
		});
	};

	useEffect(() => {
		if (!isLoading && !isError) {
			setColumns();
			setQueryFiltro();
		}
	}, [data]);

	if (isLoading) return <Loader />;
	if (isError)
		return <Typography>Hubo un error en obtener los datos</Typography>;

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

export default TransactionsReport;
