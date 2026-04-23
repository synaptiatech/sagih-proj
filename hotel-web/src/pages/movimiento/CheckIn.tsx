import { Box } from '@mui/material';
import {
	ChangeEvent,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { Content } from '../../components/card/Content';
import FormReserva from '../../components/form/FormReserva';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import PagosPdf from '../../components/show/PagosPdf';
import MiTabla from '../../components/show/Table';
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
import { formatDateTime } from '../../utils/Formateo';
import { handleError } from '../../utils/HandleError';
import swal from 'sweetalert';

export type CheckInType = {
	stateTran: 0 | 1;
};

const CheckIn = ({ stateTran }: CheckInType) => {
	const { dispatch: tranDispatch } = useContext(TransactContext);
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pagosData, setPagosData] = useState<{ checkin: any; pagos: any[] } | null>(null);
	const [openPagosModal, setOpenPagosModal] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'v_transaccion',
		pageNumber: state.currentPage,
		pageSize: state.limit,
		query: { tipo_transaccion: 'CI', estado: stateTran },
		sort: { serie: 'ASC' },
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<unknown>, p: number) => {
		event.preventDefault();
		dispatch({
			type: dataType.SET_CURRENT_PAGE,
			payload: p,
		});
	};

	const onClose = () => {
		setOpenModal(false);
		tranDispatch({ type: transactTypes.RESET });
		refetch();
	};

	const onEdit = async (checkin: any, index: number) => {
		const { data } = await dataGet({
			path: `${URI.transaccion}/documento`,
			params: {
				serie: checkin.serie,
				documento: checkin.documento,
				tipo_transaccion: checkin.tipo_transaccion,
			},
		});
		tranDispatch({
			type: transactTypes.SET_TRAN_DATA,
			payload: {
				...data,
				operacion: 'CI',
				mode: stateTran ? 'READ' : 'UPDATE',
			},
		});
		setOpenModal(true);
	};

	const onDelete = async (item: any, index: number) => {
		if (stateTran)
			return swal(
				'No se puede eliminar',
				'El check-out no se puede eliminar desde aquí porque ya fue realizado en el sistema de facturación',
				'warning'
			);
		try {
			setLoading(true);
			let result = await dataDelete({
				path: `${URI.transaccion}`,
				params: {
					action: 'D',
					serie: item.serie,
					tipo_transaccion: item.tipo_transaccion,
					documento: item.documento,
				},
				headers: {
					'fecha-operation': item.fecha,
				},
			});
			swal({
				title: 'Registro eliminado',
				text: `El check-in ${item.serie}-${item.documento} ha sido eliminado`,
				icon: 'success',
				timer: 3000,
			});
			refetch();
		} catch (error) {
			handleError('No se pudo eliminar el registro', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'check-in',
				table: 'v_reporte_transaccion',
				columns: {
					documento: 'DOCUMENTO',
					n_habitacion: 'HAB.',
					n_cliente: 'CLIENTE',
					numero_personas: 'PERSONAS',
					fecha_ingreso: 'INGRESO',
					fecha_salida: 'SALIDA',
					subtotal: 'SUBTOTAL',
					saldo: 'SALDO',
					total: 'TOTAL',
				},
				sort: {
					serie: 'ASC',
					tipo_transaccion: 'ASC',
					documento: 'ASC',
				},
				where: { tipo_transaccion: 'CI', estado: stateTran },
				sumatoria: {
					subtotal: 'SUBTOTAL',
					saldo: 'SALDO',
					total: 'TOTAL',
				},
			});
			downloadFileByBloodPart(data, 'CheckIn');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (checkin: any) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'check-in',
				table: 'v_tran_detalle',
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					codigo: 'Documento',
					habitacion: 'Habitacion',
					et_subtotal: 'Base sin IVA',
					total: 'Total',
					saldo: 'Saldo',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
					numero_personas: 'Personas',
					nombre_factura: 'Cliente',
					v_nombre: 'Vendedor',
					fecha: 'Fecha',
					descripcion: 'Descripción',
					n_servicio: 'Servicio',
					cantidad: 'Cantidad',
					precio: 'Precio',
					dt_subtotal: 'Subtotal',
				},
				masterColumns: {
					codigo: 'Documento',
					habitacion: 'Habitacion',
					et_subtotal: 'Base sin IVA',
					total: 'Total',
					saldo: 'Saldo',
					fecha_ingreso: 'Fecha ingreso',
					fecha_salida: 'Fecha salida',
				},
				detailColumns: {
					fecha: 'Fecha',
					descripcion: 'Descripción',
					n_servicio: 'Servicio',
					cantidad: 'Cantidad',
					precio: 'Precio',
					dt_subtotal: 'Subtotal',
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
				sumatoria: { dt_subtotal: 'Subtotal' },
			});
			downloadFileByBloodPart(data, 'CheckIn');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onPagos = async (checkin: any) => {
		try {
			setLoading(true);
			const { data: pagos } = await dataGet({
				path: `${URI.recibo}/porcheckin`,
				params: {
					serie: checkin.serie,
					tipo_transaccion: checkin.tipo_transaccion,
					documento: checkin.documento,
				},
			});
			setPagosData({ checkin, pagos });
			setOpenPagosModal(true);
		} catch (error) {
			handleError('No se pudieron cargar los pagos', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (data) {
			const rows = (data.rows ?? []).map((row: any) => {
				const raw = row.fecha_ingreso_completa;
				if (!raw) return row;
				const parsed = new Date(raw);
				return {
					...row,
					fecha_ingreso: isNaN(parsed.getTime())
						? row.fecha_ingreso
						: formatDateTime(parsed),
				};
			});
			dispatch({
				type: dataType.SET_METADATA,
				payload: { ...data, rows },
			});
		}
	}, [data]);

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<ToolbarOnlyRead
					title={stateTran ? 'Check-out' : 'Check-in'}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
					onDownload={onDownload}
				/>
				<Box sx={{ mt: 2 }}>
					<MiTabla
						headers={{
							serie: 'Serie',
							documento: 'Documento',
							habitacion: 'Habitacion',
							fecha_ingreso: 'Fecha Ingreso',
							subtotal: 'Subtotal',
							saldo: 'Saldo',
							total: 'Total',
						}}
						rows={state?.data || []}
						sumatoria=''
						onEdit={onEdit}
						onDelete={onDelete}
						onDownload={onDownloadOne}
						onPayments={onPagos}
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
				<FormReserva onClose={onClose} />
			</MiModal>
			<MiModal size='large' open={openPagosModal} onClose={() => setOpenPagosModal(false)}>
				{pagosData && (
					<PagosPdf checkin={pagosData.checkin} pagos={pagosData.pagos} />
				)}
			</MiModal>
		</>
	);
};

export default CheckIn;
