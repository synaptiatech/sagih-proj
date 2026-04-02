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

const normalizeDateTimeValue = (value: any) => {
	if (value === null || value === undefined) return value;

	const raw = String(value).trim();
	if (!raw) return raw;

	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(raw)) {
		return raw.replace('T', ' ');
	}

	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
		return `${raw.replace('T', ' ')}:00`;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
		return `${raw} 00:00:00`;
	}

	return raw.replace('T', ' ');
};

const isDateTimeField = (q: any) => {
	const columna = String(q?.columna || '').toLowerCase();
	return (
		columna.includes('fecha') ||
		columna.includes('date') ||
		columna.includes('timestamp')
	);
};

const Movimientos = () => {
	const [loading, setLoading] = useState(false);
	const [movesSelected, setmovesSelected] = useState(TypeMoves[0]);

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

			const reportName =
				movesSelected === 'Ventas' ? 'Movimientos' : 'Pagos';

			const { data } = await downloadFile({
				path: URI.reporte + '/parametrizado',
				name: reportName,
				table:
					movesSelected === 'Ventas'
						? 'v_reporte_transaccion'
						: 'v_reporte_recibo',
				columns: state.colsReporte,
				customWhere: state.queryFiltro
					.map((q: any) => {
						const valor = isDateTimeField(q)
							? normalizeDateTimeValue(q.valor)
							: q.valor;

						return {
							columna: q.columna,
							relacion: q.relacion,
							valor,
						};
					})
					.filter((q: any) => q.valor !== ''),
				sumatoria: {
					str_subtotal: 'Subtotal',
					str_total: 'Total',
					str_saldo: 'Saldo',
				},
			});

			downloadFileByBloodPart(data, reportName);
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Card
				sx={{
					p: 2,
					width: 'fit-content',
					ml: 'auto',
					mr: 4,
				}}
			>
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
					}}
				>
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
