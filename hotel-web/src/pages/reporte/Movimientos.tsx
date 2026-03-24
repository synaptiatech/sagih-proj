import { FormEvent, lazy, useReducer, useState } from 'react';
import Loader from '../../components/layout/loader';
import { URI } from '../../consts/Uri';
import { reporteReducer } from '../../hooks/reporteReducer';
import { downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
import { Card, Select } from '@mui/material';
import { PaymentsReport } from '../../components/PaymentsReport';
const TransactionsReport = lazy(
	() => import('../../components/TransactionsReport/TransactionsReport')
);

const TypeMoves = ['Ventas', 'Cobros'];

const Movimientos = () => {
	const [loading, setLoading] = useState(false);
	const [movesSelected, setmovesSelected] = useState(TypeMoves[0]);
	// const { data, isLoading, isError } = useFetch({
	// 	path: `${URI.transaccion}/reportes`,
	// 	table: 'v_reporte_transaccion',
	// });
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {},
		queryFiltro: [],
		title: 'Reporte de Movimientos / Transacciones',
	});

	async function handleSubmit(
		_event: FormEvent<HTMLFormElement>
	): Promise<void> {
		_event.preventDefault();
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: URI.reporte + '/parametrizado',
				name: movesSelected ? 'Movimientos' : 'Pagos',
				table:
					movesSelected === 'Ventas'
						? 'v_reporte_transaccion'
						: 'v_reporte_recibo',
				columns: state.colsReporte,
				customWhere: state.queryFiltro
					.map((q: any) => {
						return {
							columna: q.columna,
							relacion: q.relacion,
							valor: q.valor,
						};
					})
					.filter((q: any) => q.valor !== ''),
				sumatoria: {
					str_subtotal: 'Subtotal',
					str_total: 'Total',
					str_saldo: 'Saldo',
				},
			});
			downloadFileByBloodPart(
				data,
				movesSelected ? 'Movimientos' : 'Pagos'
			);
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	}

	// useEffect(() => {
	// 	if (!isLoading && !isError && data) {
	// 		const { clientes, vendedores, transacciones } = data;
	// 		console.log({
	// 			clientes: clientes.rows,
	// 			vendedores: vendedores.rows,
	// 			transacciones: transacciones.rows,
	// 		});
	// 		dispatch({
	// 			type: reporteReducerTypes.SET_QUERY_FILTRO,
	// 			payload: [
	// 				{
	// 					nombre: 'Serie',
	// 					relacion: '=',
	// 					columna: 'serie',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Transacción',
	// 					relacion: '=',
	// 					columna: 'tipo_transaccion',
	// 					valores: transacciones.rows.map((t: any) => ({
	// 						valor: t.nombre,
	// 						id: t.codigo,
	// 					})),
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Documento',
	// 					relacion: '=',
	// 					columna: 'doc',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Total',
	// 					relacion: '>=',
	// 					columna: 'total',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Fecha de ingreso',
	// 					relacion: '>=',
	// 					columna: 'dat_fecha_ingreso',
	// 					valores: [],
	// 					valor: formatDateToInput({
	// 						date: new Date(),
	// 						setDay: 1,
	// 					}),
	// 				},
	// 				{
	// 					nombre: 'y',
	// 					relacion: '<=',
	// 					columna: 'dat_fecha_ingreso',
	// 					valores: [],
	// 					valor: formatDateToInput({
	// 						date: new Date(),
	// 					}),
	// 				},
	// 				{
	// 					nombre: 'Saldo',
	// 					relacion: '>=',
	// 					columna: 'saldo',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Fecha de salida',
	// 					relacion: '>=',
	// 					columna: 'dat_fecha_salida',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'y',
	// 					relacion: '<=',
	// 					columna: 'dat_fecha_salida',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Número de personas',
	// 					relacion: '=',
	// 					columna: 'numero_personas',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Cliente',
	// 					relacion: '=',
	// 					columna: 'cliente',
	// 					valores: clientes.rows.map((c: any) => ({
	// 						valor: `${c.codigo} ${c.nombre}`,
	// 						id: c.codigo,
	// 					})),
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Cliente',
	// 					relacion: '~~*',
	// 					columna: 'n_cliente',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Vendedor',
	// 					relacion: '=',
	// 					columna: 'vendedor',
	// 					valores: vendedores.rows.map((v: any) => ({
	// 						valor: `${v.codigo} ${v.nombre}`,
	// 						id: v.codigo,
	// 					})),
	// 					valor: '',
	// 				},
	// 				{
	// 					nombre: 'Vendedor',
	// 					relacion: '~~*',
	// 					columna: 'n_vendedor',
	// 					valores: [],
	// 					valor: '',
	// 				},
	// 			],
	// 		});
	// 	}
	// }, [data]);

	// if (isLoading) return <GridSkeleton />;

	// if (isError) return <ErrorLayout error='No se pudo recuperar los datos' />;

	return (
		<>
			<Card
				sx={{
					p: 2,
					width: 'fit-content',
					ml: 'auto',
					mr: 4,
				}}>
				<Select
					sx={{ width: 200 }}
					variant='standard'
					label='Tipo de movimiento'
					size='medium'
					native
					value={movesSelected}
					disabled={loading}
					onChange={(e) => setmovesSelected(e.target.value as string)}
					inputProps={{
						name: 'tipo_movimiento',
						id: 'tipo_movimiento',
					}}>
					{TypeMoves.map((type, index) => (
						<option key={index} value={type}>
							{type}
						</option>
					))}
				</Select>
			</Card>
			{movesSelected === TypeMoves[0] ? (
				<TransactionsReport
					state={state}
					dispatch={dispatch}
					handleSubmit={handleSubmit}
				/>
			) : (
				<PaymentsReport
					state={state}
					dispatch={dispatch}
					handleSubmit={handleSubmit}
				/>
			)}
			{loading && <Loader />}
		</>
	);
};

export default Movimientos;
