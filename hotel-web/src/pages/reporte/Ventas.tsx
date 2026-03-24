import { FormEvent, useReducer, useState } from 'react';
import FormReporte from '../../components/form/FormReporte';
import Loader from '../../components/layout/loader';
import { reporteReducer } from '../../hooks/reporteReducer';
import { handleError } from '../../utils/HandleError';
import { downloadFile } from '../../services/fetching.service';
import { URI } from '../../consts/Uri';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { formatDateToInput } from '../../utils/Formateo';

const Ventas = () => {
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {
			dia: 'Día',
			servicio1: 'Servicio 1',
			servicio2: '...',
			servicio3: 'Servicio n',
			subtotal: 'Subtotal',
			compras: 'Compras',
			diferencia: 'Diferencia',
		},
		queryFiltro: [
			{
				nombre: 'Mes',
				relacion: '=',
				columna: 'fecha_ingreso',
				valores: [],
				valor: formatDateToInput({ date: new Date(), onlyMonth: true }),
			},
		],
		title: 'Reporte de ventas por día',
	});

	const handleSubmit = async (_event: FormEvent<HTMLFormElement>) => {
		_event.preventDefault();
		try {
			setLoading(true);

			const { data } = await downloadFile({
				path: `${URI.reporte}/ventas`,
				name: 'Ventas por día',
				table: 'v_services_dia',
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

export default Ventas;
