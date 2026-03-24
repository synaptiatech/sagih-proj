import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormServicio from '../../components/form/FormServicio';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiModal from '../../components/show/MiModal';
import MiTabla from '../../components/show/Table';
import { Toolbar } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { useFetch } from '../../hooks/useFetch';
import { ServicioType } from '../../props/ServicioProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Servicio = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [servicio, setServicio] = useState<ServicioType>({} as ServicioType);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.servicio._}/all`,
		table: 'v_servicio',
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
		setServicio({} as ServicioType);
		refetch();
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: dataType.SET_METADATA,
				payload: data,
			});
		}
	}, [data]);

	const onCreate = (): void => setOpenModal(true);

	const onUpload = (): void => {
		throw new Error('Function not implemented.');
	};

	const onDownload = async (): Promise<void> => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Servicio',
				table: 'v_servicio',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					descripcion: 'Descripción',
					precio_unitario: 'Precio',
					ts_nombre: 'Tipo',
				},
			});
			downloadFileByBloodPart(data, 'Servicio');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (servicio: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.servicio._,
					params: { codigo: servicio.codigo },
				});
			} catch (error) {
				handleError('No se pudo eliminar el servicio', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (servicio: any, index: number) => {
		setServicio(
			state.data.find((s: ServicioType) => s.codigo === servicio.codigo)
		);
		setOpenModal(true);
	};

	if (isLoading) <GridSkeleton />;

	if (error) <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Servicio'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						headers={{
							codigo: 'Código',
							nombre: 'Nombre',
							descripcion: 'Descripción',
							precio_unitario: 'Precio',
							ts_nombre: 'Tipo',
						}}
						rows={data?.rows || []}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
					<Paginacion
						count={state.pages}
						page={state.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{loading && <Loader />}
			<MiModal open={openModal} onClose={onClose} size='medium'>
				<FormServicio servicio={servicio} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Servicio;
