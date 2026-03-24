import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormUsuario from '../../components/form/FormUsuario';
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
import { UsuarioType } from '../../props/UsuarioProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Usuarios = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [usuario, setUsuario] = useState<UsuarioType>({} as UsuarioType);
	const [openForm, setOpenForm] = useState(false);
	const [loadDownload, setLoadDownload] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.usuario}/all`,
		table: 'usuario',
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
		setUsuario({} as UsuarioType);
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

	const onCreate = () => setOpenForm(true);

	const onUpload = () => {
		throw new Error('Function not implemented.');
	};

	const onDownload = async () => {
		try {
			setLoadDownload(true);
			const { data } = await downloadFile({
				path: URI.reporte + '/master',
				name: 'Usuarios',
				table: 'usuario',
				columns: {
					codigo: 'Codigo',
					usuario: 'Usuario',
					correo: 'Correo',
					perfil: 'Perfil',
				},
			});
			downloadFileByBloodPart(data, 'Usuarios');
		} catch (error) {
			handleError('', error);
		} finally {
			setLoadDownload(false);
		}
	};

	const onDownloadOne = (usuario: any) => {
		throw new Error('Function not implemented.');
	};

	const onDelete = async (usuario: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.usuario,
					params: { codigo: usuario.codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el registro', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (usuario: any, index: number) => {
		setUsuario(
			usuario
			// state.data.find((u: UsuarioType) => u.codigo === usuario.codigo)
		);
		setOpenForm(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Usuario'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						headers={{
							codigo: 'Codigo',
							usuario: 'Usuario',
							correo: 'Correo',
							perfil: 'Perfil',
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
			{loadDownload && <Loader />}
			<MiModal open={openForm} onClose={onClose} size='medium'>
				<FormUsuario usuario={usuario} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Usuarios;
