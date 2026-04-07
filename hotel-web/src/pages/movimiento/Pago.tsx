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
		path: `${URI.recibo}/all`,
		table: 'v_rc_encabezado',
		pageNumber: stateFetch.currentPage,
		pageSize: stateFetch.limit,
		sort: { serie: 'ASC' },
		query: { tipo_transaccion: 'RC' },
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
				name: 'Recibos',
				table: 'v_rc_encabezado',
				columns: {
					serie: 'Serie',
					documento: 'Documento',
					c_nombre: 'Cliente',
					v_nombre: 'Vendedor',
					fecha: 'Fecha',
					abono: 'Abono',
				},
				sumatoria: {
					abono: 'Abono',
				},
			});
			downloadFileByBloodPart(data, 'Recibos');
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
				name: 'Recibos',
				table: 'v_rc_detalle',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo transacción',
					documento: 'Documento',
					serie_fac: 'Serie factura',
					ti_tran_fac: 'Tipo transacción factura',
					documento_fac: 'Documento factura',
					fecha: 'Fecha',
					descripcion: 'Descripción',
					tp_nombre: 'Tipo pago',
					monto: 'Monto',
				},
				masterColumns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo transacción',
					documento: 'Documento',
					fecha: 'Fecha',
				},
				detailColumns: {
					serie_fac: 'Serie',
					ti_tran_fac: 'Tipo',
					documento_fac: 'Documento',
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
			downloadFileByBloodPart(data, 'Recibos');
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
	};

	const onDelete = (item: any, index: number) => {};

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
							documento: 'Documento',
							c_nombre: 'Cliente',
							v_nombre: 'Vendedor',
							fecha: 'Fecha',
							abono: 'Abono',
						}}
						rows={data?.rows || []}
						sumatoria='abono'
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
