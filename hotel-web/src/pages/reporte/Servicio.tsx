import { FormEvent, useEffect, useReducer, useRef, useState } from 'react';
import dayjs from 'dayjs';
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
import { downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';

const API_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const toApiDate = (date: Date) => {
	return dayjs(date).format(API_DATE_FORMAT);
};

const Servicio = () => {
	const [loading, setLoading] = useState(false);
	const initializedRef = useRef(false);

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
					let valor = q.valor;

					if (
						q.columna?.includes('fecha') &&
						valor !== '' &&
						valor !== null &&
						valor !== undefined
					) {
						const parsed = dayjs(valor);
						valor = parsed.isValid()
							? parsed.format(API_DATE_FORMAT)
							: valor;
					}

					return {
						columna: q.columna,
						relacion: q.relacion,
						valor,
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
				customWhere,
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
		if (!data || initializedRef.current) return;

		const { clientes, habitacion, servicios } = data;

		dispatch({
			type: reporteReducerTypes.SET_QUERY_FILTRO,
			payload: [
				{
					nombre: 'Servicio',
					relacion: '=',
					columna: 'servicio',
					valores: servicios.map((s: ServicioType) => ({
						valor: `${s.codigo} ${s.nombre}`,
						id: s.codigo,
					})),
					valor: '',
				},
				{
					nombre: 'Habitación',
					relacion: '=',
					columna: 'habitacion',
					valores: habitacion.map((h: HabitacionType) => ({
						valor: `${h.codigo}`,
						id: h.codigo,
					})),
					valor: '',
				},
				{
					nombre: 'Cliente',
					relacion: '=',
					columna: 'cliente',
					valores: clientes.map((c: ClienteType) => ({
						valor: `${c.codigo} ${c.nombre}`,
						id: c.codigo,
					})),
					valor: '',
				},
				{
					nombre: 'Fecha de ingreso',
					relacion: '>=',
					columna: 'dat_fecha_ingreso',
					valores: [],
					valor: toApiDate(new Date(new Date().setDate(1))),
				},
				{
					nombre: 'y',
					relacion: '<=',
					columna: 'dat_fecha_ingreso',
					valores: [],
					valor: toApiDate(new Date()),
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

		initializedRef.current = true;
	}, [data]);

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
