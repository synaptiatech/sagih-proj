import { FormEvent, useReducer, useState } from 'react';
import FormReporte from '../../components/form/FormReporte';
import Loader from '../../components/layout/loader';
import { reporteReducer } from '../../hooks/reporteReducer';
import { downloadFile } from '../../services/fetching.service';
import { URI } from '../../consts/Uri';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
import { formatDateToInput } from '../../utils/Formateo';

const Habitacion = () => {
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {
			dia: 'Habitación',
			servicio1: 'Servicio 1',
			servicio2: '...',
			servicio3: 'Servicio n',
			subtotal: 'Subtotal',
			compras: 'Cobro',
			diferencia: 'Saldo',
		},
		queryFiltro: [
			{
				nombre: 'Fecha de ingreso',
				relacion: '>=',
				columna: 'fecha_ingreso',
				valores: [],
				valor: formatDateToInput({ date: new Date(), setDay: 1 }),
			},
			{
				nombre: 'y',
				relacion: '<=',
				columna: 'fecha_ingreso',
				valores: [],
				valor: formatDateToInput({ date: new Date() }),
			},
		],
		title: 'Reporte de ventas por habitación',
	});

	const handleSubmit = async (_event: FormEvent<HTMLFormElement>) => {
		_event.preventDefault();
		try {
			setLoading(true);

			const { data } = await downloadFile({
				path: `${URI.reporte}/ventas-habitacion`,
				name: 'Ventas por habitación',
				table: 'v_sales_hab',
				sort: state.queryFiltro,
			});
			downloadFileByBloodPart(data, 'Ventas por habitación');
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

export default Habitacion;
