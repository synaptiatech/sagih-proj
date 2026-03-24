import { FormEvent, useReducer, useState } from 'react';
import { reporteReducer } from '../../hooks/reporteReducer';
import { downloadFile } from '../../services/fetching.service';
import { URI } from '../../consts/Uri';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
import FormReporte from '../../components/form/FormReporte';
import Loader from '../../components/layout/loader';
import { formatDateToInput } from '../../utils/Formateo';

const Usabilidad = () => {
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {
			habitacion: 'Habitacion',
			dia1: 'Día 1',
			dia2: '...',
			dia3: 'Día n',
			usabilidad: 'Usabilidad',
		},
		queryFiltro: [
			{
				nombre: 'Mes de ingreso',
				relacion: '=',
				columna: 'fecha_ingreso',
				valores: [],
				valor: formatDateToInput({ date: new Date(), onlyMonth: true }),
			},
		],
		title: 'Reporte de usabilidad',
	});

	const handleSubmit = async (_event: FormEvent<HTMLFormElement>) => {
		_event.preventDefault();
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/usabilidad`,
				name: 'Usabilidad por habitación',
				table: 'v_usabilidad',
				sort: state.queryFiltro,
			});
			downloadFileByBloodPart(data, 'Usabilidad');
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

export default Usabilidad;
