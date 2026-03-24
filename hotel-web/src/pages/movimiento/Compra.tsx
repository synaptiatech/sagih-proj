import { Box } from '@mui/material';
import {
	ChangeEvent,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import swal from 'sweetalert';
import { Content } from '../../components/card/Content';
import FormCompra from '../../components/form/FormCompra';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import MiTabla from '../../components/show/Table';
import { Toolbar } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { ComprasContext } from '../../contexts/ComprasProvider';
import { comprasTypes } from '../../hooks/correlativoReducer';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { useFetch } from '../../hooks/useFetch';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleError } from '../../utils/HandleError';

const Compra = () => {
	const { dispatch: compraDispatch } = useContext(ComprasContext);
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const {
		data: compras,
		isLoading,
		isError,
		refetch,
	} = useFetch({
		path: `${URI.compra}/all`,
		table: 'v_pp_tranenc',
		pageNumber: state.currentPage,
		pageSize: state.limit,
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<unknown>, p: number) => {
		event.preventDefault();
		dispatch({ type: dataType.SET_CURRENT_PAGE, payload: p });
	};

	const onClose = () => {
		setOpenModal(false);
		compraDispatch({
			type: comprasTypes.RESET,
		});
		refetch();
	};

	const onCreate = () => {
		compraDispatch({
			type: comprasTypes.SET_CORRELATIVO,
			payload: { tipo_transaccion: 'CO' },
		});
		setOpenModal(true);
	};
	const onEdit = (item: any, index: number) => {
		compraDispatch({
			type: comprasTypes.SET_DATA,
			payload: { compras: item },
		});
		setOpenModal(true);
	};

	const onDelete = (item: any, index: number) => {
		swal({
			title: '¿Está seguro?',
			text: `Está a punto de eliminar la compra ${item.serie}-${item.documento}`,
			icon: 'warning',
			buttons: ['Cancelar', 'Aceptar'],
			dangerMode: true,
		}).then(async (willDelete) => {
			if (willDelete) {
				try {
					setLoading(true);
					await dataDelete({
						path: `${URI.compra}`,
						params: {
							tipo_transaccion: item.tipo_transaccion,
							serie: item.serie,
							documento: item.documento,
						},
					});
					refetch();
					swal('La compra ha sido eliminada', {
						icon: 'success',
					});
				} catch (error) {
					handleError('Error al eliminar la compra', error);
				} finally {
					setLoading(false);
				}
			}
		});
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Compras',
				table: 'v_pp_tranenc',
				sort: { fecha: 'DESC' },
				columns: {
					serie: 'Serie',
					tipo_transaccion: 'Tipo',
					documento: 'Documento',
					fecha: 'Fecha',
					nombre: 'Proveedor',
					nit: 'Nit',
					descripcion: 'Descripción',
					iva: 'Iva',
					total: 'Subtotal',
				},
				sumatoria: {
					total: 'Subtotal',
				},
			});
			downloadFileByBloodPart(data, 'Compras');
		} catch (error) {
			handleError('Error al descargar los datos', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (compras) {
			dispatch({
				type: dataType.SET_METADATA,
				payload: compras,
			});
		}
	}, [compras]);

	if (isLoading) return <GridSkeleton />;

	if (isError) return <ErrorLayout error='Error al cargar los datos' />;

	return (
		<>
			<Content>
				<Toolbar
					title='Compras'
					onSearch={(filter: string) =>
						dispatch({
							type: dataType.SET_FILTER,
							payload: filter,
						})
					}
					onCreate={onCreate}
					onDownload={onDownload}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						rows={compras?.rows || []}
						headers={{
							serie: 'Serie',
							tipo_transaccion: 'Tipo',
							documento: 'Doc',
							fecha: 'Fecha',
							nombre: 'Proveedor',
							descripcion: 'Descripción',
							iva: 'Iva',
							total: 'Subtotal',
						}}
						sumatoria={'total'}
						onDelete={onDelete}
						onEdit={onEdit}
					/>
					<Paginacion
						count={state.pages}
						page={state.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{loading && <Loader />}
			<MiModal size='m-large' open={openModal} onClose={onClose}>
				<FormCompra onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Compra;
