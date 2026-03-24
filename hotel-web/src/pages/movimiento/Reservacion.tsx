import { Box } from '@mui/material';
import {
	ChangeEvent,
	lazy,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import swal from 'sweetalert';
import { ToolbarOnlyRead } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import {
	dataDelete,
	dataGet,
	downloadFile,
} from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';
const FormReserva = lazy(() => import('../../components/form/FormReserva'));
const ErrorLayout = lazy(() => import('../../components/layout/error'));
const GridSkeleton = lazy(() => import('../../components/layout/waiting'));
const MiModal = lazy(() => import('../../components/show/MiModal'));
import { Content } from '../../components/card/Content';
const Paginacion = lazy(() => import('../../components/paginacion/Paginacion'));
const MiTabla = lazy(() => import('../../components/show/Table'));

const Reservacion = () => {
	const { dispatch: tranDispatch } = useContext(TransactContext);
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'v_transaccion',
		pageNumber: state.currentPage,
		pageSize: state.limit,
		query: { tipo_transaccion: 'RE', estado: 0 },
		sort: { serie: 'ASC' },
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<unknown>, p: number) => {
		event.preventDefault();
		dispatch({ type: dataType.SET_CURRENT_PAGE, payload: p });
	};

	const onClose = () => {
		setOpenModal(false);
		tranDispatch({ type: transactTypes.RESET });
		refetch();
	};

	const onEdit = async (item: any, index: number) => {
		const { data } = await dataGet({
			path: `${URI.transaccion}/documento`,
			params: {
				serie: item.serie,
				documento: item.documento,
				tipo_transaccion: item.tipo_transaccion,
			},
		});
		tranDispatch({
			type: transactTypes.SET_TRAN_DATA,
			payload: { ...data, operacion: 'RE', mode: 'UPDATE' },
		});
		setOpenModal(true);
	};

	const onDelete = async (item: any, index: number) => {
		try {
			setLoading(true);
			console.log({ item });
			let result = await dataDelete({
				path: `${URI.transaccion}`,
				params: {
					action: 'D',
					serie: item.serie,
					tipo_transaccion: item.tipo_transaccion,
					documento: +item.documento,
				},
				headers: {
					'fecha-operation': item.fecha,
				},
			});
			swal({
				title: 'Reservación eliminada',
				text: `La reservación ${item.serie}-${item.documento} ha sido eliminada`,
				icon: 'success',
				timer: 3000,
			});
			refetch();
		} catch (error) {
			handleError('Error al eliminar la reservación', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Reservaciones',
				table: 'v_reporte_transaccion',
				columns: {
					documento: 'DOCUMENTO',
					n_habitacion: 'HAB.',
					n_cliente: 'CLIENTE',
					numero_personas: 'PERSONAS',
					fecha_ingreso: 'INGRESO',
					subtotal: 'SUBTOTAL',
					saldo: 'SALDO',
					total: 'TOTAL',
				},
				sort: {
					serie: 'ASC',
					tipo_transaccion: 'ASC',
					documento: 'ASC',
				},
				where: { tipo_transaccion: 'RE', estado: 0 },
				sumatoria: {
					subtotal: 'SUBTOTAL',
					saldo: 'SALDO',
					total: 'TOTAL',
				},
			});
			downloadFileByBloodPart(data, 'Reservaciones');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (item: any) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Reservacion',
				table: 'v_tran_detalle',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					codigo: 'Documento',
					habitacion: 'Habitacion',
					et_subtotal: 'Subtotal',
					total: 'Total',
					saldo: 'Saldo',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
					numero_personas: 'Personas',
					nombre_factura: 'Cliente',
					v_nombre: 'Vendedor',
					fecha: 'Fecha',
					descripcion: 'Descripción',
					servicio: 'Servicio',
					cantidad: 'Cantidad',
					precio: 'Precio',
					dt_subtotal: 'Subtotal',
				},
				masterColumns: {
					codigo: 'Documento',
					habitacion: 'Habitacion',
					et_subtotal: 'Subtotal',
					total: 'Total',
					saldo: 'Saldo',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
				},
				detailColumns: {
					fecha: 'Fecha',
					descripcion: 'Descripción',
					servicio: 'Servicio',
					cantidad: 'Cantidad',
					precio: 'Precio',
					dt_subtotal: 'Subtotal',
				},
				where: {
					tipo_transaccion: 'RE',
					serie: item.serie,
					documento: item.documento,
				},
			});
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: dataType.SET_METADATA,
				payload: data,
			});
		}
	}, [data]);

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<ToolbarOnlyRead
					title='Reservaciones'
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
					onDownload={onDownload}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						headers={{
							serie: 'Serie',
							documento: 'Documento',
							habitacion: 'Habitacion',
							fecha_ingreso: 'Fecha',
							subtotal: 'Subtotal',
							saldo: 'Saldo',
							total: 'Total',
						}}
						rows={state?.data || []}
						sumatoria='total'
						onEdit={onEdit}
						onDelete={onDelete}
						onDownload={onDownloadOne}
					/>
					<Paginacion
						count={state.pages}
						page={state.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{openModal && (
				<MiModal size='large' open={openModal} onClose={onClose}>
					<FormReserva onClose={onClose} />
				</MiModal>
			)}
		</>
	);
};

export default Reservacion;
