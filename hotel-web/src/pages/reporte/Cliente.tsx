import { FormEvent, useEffect, useReducer, useState } from 'react';
import FormReporte from '../../components/form/FormReporte';
import {
	reporteReducer,
	reporteReducerTypes,
} from '../../hooks/reporteReducer';
import { useFetchData } from '../../hooks/useFetch';
import { URI } from '../../consts/Uri';
import { ClienteType } from '../../props/ClienteProps';
import GridSkeleton from '../../components/layout/waiting';
import ErrorLayout from '../../components/layout/error';
import { downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
import Loader from '../../components/layout/loader';

const Cliente = () => {
	const [loading, setLoading] = useState(false);
	const { data, isLoading, error } = useFetchData({
		path: URI.cliente + '/reportes',
		query: {},
	});
	const [state, dispatch] = useReducer(reporteReducer, {
		colsReporte: {
			codigo: 'CODIGO',
			nombre: 'NOMBRE',
			nombre_c: 'NOMBRE COMERCIAL',
			nit: 'NIT',
			telefono_celular: 'TELEFONO',
			str_saldo: 'SALDO',
		},
		queryFiltro: [],
		title: 'Reporte de clientes',
	});

	async function handleSubmit(
		_event: FormEvent<HTMLFormElement>
	): Promise<void> {
		_event.preventDefault();
		try {
			setLoading(true);

			const { data } = await downloadFile({
				path: `${URI.reporte}/parametrizado`,
				name: 'Clientes',
				table: 'v_cliente',
				columns: state.colsReporte,
				customWhere: state.queryFiltro
					.map((q: any) => ({
						columna: q.columna,
						relacion: q.relacion === '' && q.columna === 'nombre' ? '~~*' : q.relacion,
						valor: q.valor,
					}))
					.filter((q: any) => q.valor !== ''),
				sumatoria: { str_saldo: 'Saldo' },
			});
			downloadFileByBloodPart(data, 'Clientes');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (data) {
			const { clientes } = data;

			dispatch({
				type: reporteReducerTypes.SET_QUERY_FILTRO,
				payload: [
					{
						nombre: 'Buscar por nombre',
						relacion: '',
						columna: 'nombre',
						valores: [],
						valor: '',
					},
					{
						nombre: 'Codigo',
						relacion: '=',
						columna: 'codigo',
						valores: clientes.map((cliente: ClienteType) => {
							return {
								valor: `${cliente.codigo} ${cliente.nombre}`,
								id: cliente.codigo,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Nombre',
						relacion: '=',
						columna: 'nombre',
						valores: clientes.map((cliente: ClienteType) => {
							return {
								valor: `${cliente.nombre}`,
								id: cliente.nombre,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Nombre comercial',
						relacion: '=',
						columna: 'nombre_c',
						valores: clientes.map((cliente: ClienteType) => {
							return {
								valor: `${cliente.nombre_c}`,
								id: cliente.nombre_c,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Nombre factura',
						relacion: '=',
						columna: 'nombre_fac',
						valores: clientes.map((cliente: ClienteType) => {
							return {
								valor: `${cliente.nombre_factura}`,
								id: cliente.nombre_factura,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Nit',
						relacion: '=',
						columna: 'nit',
						valores: clientes.map((cliente: ClienteType) => {
							return {
								valor: `${cliente.nit}`,
								id: cliente.nit,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Nit factura',
						relacion: '=',
						columna: 'nit_fac',
						valores: clientes.map((cliente: ClienteType) => {
							return {
								valor: `${cliente.nit_factura}`,
								id: cliente.nit_factura,
							};
						}),
						valor: '',
					},
					{
						nombre: 'Saldo',
						columna: 'saldo',
						relacion: '>=',
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

export default Cliente;
