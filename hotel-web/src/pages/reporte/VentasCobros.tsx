import { FormEvent, useReducer, useState } from 'react';
import FormReporte from '../../components/form/FormReporte';
import Loader from '../../components/layout/loader';
import { URI } from '../../consts/Uri';
import { reporteReducer } from '../../hooks/reporteReducer';
import { downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
import { formatDateToInput } from '../../utils/Formateo';

const VentasCobros = () => {
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {
			dia: 'Día',
			ventas: 'Ventas',
			pago1: 'Método de pago 1',
			pago2: '...',
			pago3: 'Método de pago n',
			cobro: 'Cobro',
			saldo: 'Saldo',
		},
		queryFiltro: [
			{
				nombre: 'Fecha de ingreso',
				relacion: '>=',
				columna: 'et.fecha',
				valores: [],
				valor: formatDateToInput({ date: new Date(), setDay: 1 }),
			},
			{
				nombre: 'y',
				relacion: '<=',
				columna: 'et.fecha',
				valores: [],
				valor: formatDateToInput({ date: new Date() }),
			},
		],
		title: 'Reporte de cobros y ventas',
	});

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/ventas-cobros`,
				name: 'cobros y ventas',
				table: 'v_sales_and_payments',
				sort: state.queryFiltro,
			});
			downloadFileByBloodPart(data, 'Ventas');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<FormReporte
				state={state}
				dispatch={dispatch}
				handleSubmit={handleSubmit}
			/>
			{loading && <Loader />}
		</>
	);
};

export default VentasCobros;
