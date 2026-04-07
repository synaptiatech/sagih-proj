import { Box } from '@mui/material';
import {
	ChangeEvent,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { Content } from '../../components/card/Content';
import { FormRoomPayments } from '../../components/form/FormRoomPayments';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import MiTabla from '../../components/show/Table';
import { Toolbar } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import { dataGet, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';

const Pago = () => {
	const { dispatch: tranDispatch } = useContext(TransactContext);
	const [stateFetch, dispatchFetch] = useReducer(dataReducer, dataDefault);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.pago}/all`,
		pageNumber: stateFetch.currentPage,
		pageSize: stateFetch.limit,
		q: stateFetch.q,
	});

	const handleChange = (e: ChangeEvent<unknown>, p: number) => {
		e.preventDefault();
		dispatchFetch({
			type: dataType.SET_CURRENT_PAGE,
			payload: p,
		});
	};

	const onClose = () => {
		tranDispatch({ type: transactTypes.RESET });
		setShowModal(false);
		refetch();
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Pagos',
				table: 'v_rc_detalle',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					serie_fac: 'Serie factura',
					ti_tran_fac: 'Tipo factura',
					documento_fac: 'Documento factura',
					fecha: 'Fecha / Hora',
					descripcion: 'Descripción',
					tp_nombre: 'Tipo pago',
					monto: 'Monto',
				},
				sumatoria: {
					monto: 'Monto',
				},
			});
			downloadFileByBloodPart(data, 'Pagos');
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
				name: 'Pago',
				table: 'v_rc_detalle',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo transacción',
					documento: 'Documento',
					serie_fac: 'Serie factura',
					ti_tran_fac: 'Tipo transacción factura',
					documento_fac: 'Documento factura',
					fecha: 'Fecha / Hora',
					descripcion: 'Descripción',
					tp_nombre: 'Tipo pago',
					monto: 'Monto',
				},
				masterColumns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo transacción',
					documento: 'Documento',
					fecha: 'Fecha / Hora',
				},
				detailColumns: {
					serie_fac: 'Serie factura',
					ti_tran_fac: 'Tipo factura',
					documento_fac: 'Documento factura',
					descripcion: 'Descripción',
					tp_nombre: 'Tipo pago',
					monto: 'Monto',
				},
				where: {
					serie: item.serie,
					documento: item.documento,
					tipo_transaccion: item.tipo_transaccion,
				},
			});
			downloadFileByBloodPart(data, 'Pago');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onCreate = () => {
		setShowModal(true);
	};

	const onEdit = async (item: any, index: number) => {
		try {
			const { data } = await dataGet({
				path: `${URI.transaccion}/documento`,
				params: {
					serie: item.serie_fac,
					tipo_transaccion: item.ti_tran_fac,
					documento: item.documento_fac,
				},
			});

			tranDispatch({
				type: transactTypes.SET_TRAN_DATA,
				payload: { ...data, operacion: 'CI', mode: 'UPDATE' },
			});

			setShowModal(true);
		} catch (error) {
			handleError('Error al cargar el pago', error);
		}
	};

	const onDelete = (item: any, index: number) => {
		// pendiente según tu lógica actual
	};

	useEffect(() => {
		if (data) {
			dispatchFetch({
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
				<Toolbar
					title='Pagos'
					onSearch={(filter: string) =>
						dispatchFetch({
							type: dataType.SET_FILTER,
							payload: filter,
						})
					}
					onCreate={onCreate}
					onDownload={onDownload}
				/>
				<Box sx={{ mt: 2 }}>
					<MiTabla
						headers={{
							serie: 'Serie',
							tipo_transaccion: 'Tipo',
							documento: 'Documento',
							fecha: 'Fecha / Hora',
							tipo_pago_nombre: 'Tipo pago',
							monto: 'Monto',
						}}
						rows={data?.rows || []}
						sumatoria='monto'
						onEdit={onEdit}
						onDownload={onDownloadOne}
						onDelete={onDelete}
					/>
					<Paginacion
						count={stateFetch.pages}
						page={stateFetch.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{loading && <Loader />}
			{showModal && (
				<MiModal size={'medium'} open={showModal} onClose={onClose}>
					<FormRoomPayments onClose={onClose} />
				</MiModal>
			)}
		</>
	);
};

export default Pago;
