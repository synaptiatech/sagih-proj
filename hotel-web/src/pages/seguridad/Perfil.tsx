import { Box } from '@mui/material';
import { ChangeEvent, useContext, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import { FormPerfil } from '../../components/form/FormPerfil';
import { Permisos } from '../../components/form/Permisos';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import MiTabla from '../../components/show/Table';
import { Toolbar } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { PerfilContext } from '../../contexts/PerfilProvider';
import { perfilTypes } from '../../hooks/PerfilReducer';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { useFetch } from '../../hooks/useFetch';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';
import MiModal from '../../components/show/MiModal';

const Perfil = () => {
	const { dispatch: perfilDispatch } = useContext(PerfilContext);
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [openForm, setOpenForm] = useState(false);
	const [openPerms, setOpenPerms] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, isError, isLoading, refetch } = useFetch({
		path: `${URI.perfil}/all`,
		table: 'perfil',
		sort: { codigo: 'ASC' },
		pageNumber: state.currentPage,
		pageSize: state.limit,
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<unknown>, p: number) => {
		event.preventDefault();
		dispatch({ type: dataType.SET_CURRENT_PAGE, payload: p });
	};

	const onClose = () => {
		setOpenForm(false);
		setOpenPerms(false);
		perfilDispatch({
			type: perfilTypes.RESET,
		});
		refetch();
	};

	const onCreate = () => {
		setOpenForm(true);
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: URI.reporte + '/master',
				name: 'Reporte de perfil',
				table: 'perfil',
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					descripcion: 'Descripción',
				},
				sort: { codigo: 'ASC' },
			});
			downloadFileByBloodPart(data, 'Perfil');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (row: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.perfil,
					params: { codigo: row.codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el perfil', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = async (row: any, index: number) => {
		perfilDispatch({
			type: perfilTypes.SET_PERFIL,
			payload: row,
		});
		setOpenForm(true);
	};

	const onPermission = async (row: any) => {
		perfilDispatch({
			type: perfilTypes.SET_PERFIL,
			payload: row,
		});
		setOpenPerms(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (isError)
		return <ErrorLayout error='No se pudieron obtener los registros' />;

	return (
		<>
			<Content>
				<Toolbar
					title='Perfil'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						rows={data || []}
						headers={{
							codigo: 'Código',
							nombre: 'Nombre',
							descripcion: 'Descripción',
						}}
						onDelete={onDelete}
						onEdit={onEdit}
						onPermission={onPermission}
						sumatoria={''}
					/>
					<Paginacion
						count={state.pages}
						page={state.currentPage}
						onChange={handleChange}
					/>
				</Box>
			</Content>
			{loading && <Loader />}
			<MiModal open={openForm} onClose={onClose} size='small'>
				<FormPerfil onClose={onClose} />
			</MiModal>
			<MiModal open={openPerms} onClose={onClose} size='m-large'>
				<Permisos onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Perfil;
