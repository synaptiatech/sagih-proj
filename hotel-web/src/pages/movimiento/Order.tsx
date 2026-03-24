import { Box } from '@mui/material';
import {
	ChangeEvent,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { Content } from '../../components/card/Content';
import { FormRoomServices } from '../../components/form/FormRoomServices';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import MiTabla from '../../components/show/Table';
import { ToolbarOnlyRead } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import { dataGet, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';

const Orden = () => {
	const { dispatch: tranDispatch } = useContext(TransactContext);
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'v_transaccion',
		pageNumber: state.currentPage,
		pageSize: state.limit,
		query: { tipo_transaccion: 'CI', estado: 0 },
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
		refetch;
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: dataType.SET_METADATA,
				payload: data,
			});
		}
	}, [data]);

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Servicios a la habitación',
				table: 'v_reporte_transaccion',
				columns: {
					documento: 'Documento',
					n_cliente: 'Cliente',
					numero_personas: 'Personas',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
					saldo: 'Saldo',
					total: 'Total',
				},
				sort: {
					serie: 'ASC',
					tipo_transaccion: 'ASC',
					documento: 'ASC',
				},
				where: { tipo_transaccion: 'CI' },
				sumatoria: {
					saldo: 'Saldo',
					total: 'Total',
				},
			});
			downloadFileByBloodPart(data, 'Servicios a la habitación');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (checkin: any) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'servicios a la habitacion',
				table: 'detalle_transaccion',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					descripcion: 'Descripción',
					habitacion: 'Habitacion',
					servicio: 'Servicio',
					precio: 'Precio',
					cantidad: 'Cantidad',
					subtotal: 'Subtotal',
				},
				masterColumns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					habitacion: 'Habitacion',
				},
				detailColumns: {
					servicio: 'Servicio',
					descripcion: 'Descripción',
					precio: 'Precio',
					cantidad: 'Cantidad',
					subtotal: 'Subtotal',
				},
				sort: {
					serie: 'ASC',
					tipo_transaccion: 'ASC',
					documento: 'ASC',
				},
				where: {
					tipo_transaccion: 'CI',
					serie: checkin.serie,
					documento: checkin.documento,
				},
			});
			downloadFileByBloodPart(data, 'CheckIn');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onEdit = async (item: any, index: number) => {
		const { data } = await dataGet({
			path: `${URI.transaccion}/documento`,
			params: {
				serie: item.serie,
				tipo_transaccion: item.tipo_transaccion,
				documento: item.documento,
			},
		});
		tranDispatch({
			type: transactTypes.SET_TRAN_DATA,
			payload: data,
			mode: 'UPDATE',
		});
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<ToolbarOnlyRead
					title='Servicios a la habitación'
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
							fecha_ingreso: 'Fecha Ingreso',
							nombre_vendedor: 'Vendedor',
							subtotal: 'Subtotal',
							total: 'Total',
							saldo: 'Saldo',
						}}
						rows={state?.data || []}
						sumatoria='total'
						onEdit={onEdit}
						onDownload={onDownloadOne}
					/>
					<Paginacion
						count={state.pages}
						page={state.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{loading && <Loader />}
			<MiModal size='large' open={openModal} onClose={onClose}>
				<FormRoomServices onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Orden;
