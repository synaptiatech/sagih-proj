import { FormEvent, useEffect, useReducer, useState } from 'react';
import FormReporte from '../../components/form/FormReporte';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import { URI } from '../../consts/Uri';
import {
	reporteReducer,
	reporteReducerTypes,
} from '../../hooks/reporteReducer';
import { useFetch } from '../../hooks/useFetch';
import { ClienteType } from '../../props/ClienteProps';
import { HabitacionType } from '../../props/HabitacionProps';
import { ServicioType } from '../../props/ServicioProps';
import { TiposType } from '../../props/Tipos';
import { downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
import { formatDateToInput } from '../../utils/Formateo';

const Servicio = () => {
	const [loading, setLoading] = useState(false);
	const { data, isLoading, error } = useFetch({
		path: `${URI.servicio._}/reportes`,
		table: 'v_reporte_servicio',
	});
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {
			documento: 'DOCUMENTO',
			h_nombre: 'HABITACION',
			fecha_ingreso: 'INGRESO',
			fecha_salida: 'SALIDA',
			descripcion: 'DESC.',
			c_nombre: 'CLIENTE',
			s_nombre: 'SERVICIO',
			subtotal: 'SUBTOTAL',
		},
		queryFiltro: [],
		title: 'Reporte de servicios',
	});

	async function handleSubmit(
		_event: FormEvent<HTMLFormElement>
	): Promise<void> {
		_event.preventDefault();
		try {
			setLoading(true);

			const customWhere = state.queryFiltro
				.map((q: any) => {
					return {
						columna: q.columna,
						relacion: q.relacion,
						valor: q.valor,
					};
				})
				.filter((q: any) => q.valor !== '');
			customWhere.push({
				columna: 'tipo_transaccion',
				relacion: '=',
				valor: 'CI',
			});

			const { data } = await downloadFile({
				path: `${URI.reporte}/parametrizado`,
				name: 'Servicios',
				table: 'v_reporte_servicio',
				columns: state.colsReporte,
				customWhere: customWhere,
				sumatoria: {
					subtotal: 'Subtotal',
				},
			});
			downloadFileByBloodPart(data, 'Servicios');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (data) {
			const { clientes, habitacion, servicios, tiTran } = data;

			dispatch({
				type: reporteReducerTypes.SET_QUERY_FILTRO,
				payload: [
					{
						nombre: 'Servicio',
						relacion: '=',
						columna: 'servicio',
						valores: servicios.map((s: ServicioType) => {
							return {
								valor: `${s.codigo} ${s.nombre}`,
								id: s.codigo,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Habitación',
						relacion: '=',
						columna: 'habitacion',
						valores: habitacion.map((h: HabitacionType) => {
							return {
								valor: `${h.codigo}`,
								id: h.codigo,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Cliente',
						relacion: '=',
						columna: 'cliente',
						valores: clientes.map((c: ClienteType) => {
							return {
								valor: `${c.codigo} ${c.nombre}`,
								id: c.codigo,
							};
						}),
						valor: '',
					},
					// {
					// 	nombre: 'Tipo de transacción',
					// 	relacion: '=',
					// 	columna: 'tipo_transaccion',
					// 	valores: tiTran.map((t: TiposType) => {
					// 		return {
					// 			valor: `${t.codigo}`,
					// 			id: t.codigo,
					// 		};
					// 	}),
					// 	valor: '',
					// },
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
						nombre: 'Subtotal',
						columna: 'num_subtotal',
						relacion: '>=',
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
				],
			});
		}
	}, [isLoading, data]);

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

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

export default Servicio;
