import React, { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { ProveedorType } from '../../../props/ProductoProps';
import { dataDefault, dataReducer, dataType } from '../../../hooks/dataReducer';
import { useFetch } from '../../../hooks/useFetch';
import { URI } from '../../../consts/Uri';
import { dataDelete, downloadFile } from '../../../services/fetching.service';
import { downloadFileByBloodPart } from '../../../utils/DownloadFile';
import { handleDelete, handleError } from '../../../utils/HandleError';
import GridSkeleton from '../../../components/layout/waiting';
import ErrorLayout from '../../../components/layout/error';
import { Content } from '../../../components/card/Content';
import { Toolbar } from '../../../components/show/Toolbar';
import { Box } from '@mui/material';
import MiTabla from '../../../components/show/Table';
import Paginacion from '../../../components/paginacion/Paginacion';
import Loader from '../../../components/layout/loader';
import MiModal from '../../../components/show/MiModal';
import FormProveedor from '../../../components/form/FormProducto';

export type ProveedorProps = {};

const Proveedor: React.FC<ProveedorProps> = ({}) => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [proveedor, setProveedor] = useState({} as ProveedorType);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, isLoading, isError, refetch } = useFetch({
		path: `${URI.producto}/all`,
		table: 'proveedor',
		pageNumber: state.currentPage,
		pageSize: state.limit,
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<any>, p: number) => {
		event.preventDefault();
		dispatch({ type: dataType.SET_CURRENT_PAGE, payload: p });
	};

	const onClose = () => {
		setOpenModal(false);
		setProveedor({} as ProveedorType);
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

	const onCreate = () => {
		setOpenModal(true);
	};

	const onUpload = () => {
		throw new Error('Function not implemented.');
	};

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Proveedores',
				table: 'proveedor',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Codigo',
					nombre: 'Nombre',
					direccion: 'Direccion',
					telefono: 'Telefono',
					nit: 'Nit',
				},
			});
			downloadFileByBloodPart(data, 'Proveedor');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = (proveedor: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.producto,
					params: { codigo: proveedor.codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el registro', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (producto: any, index: number) => {
		setProveedor(
			state.data.find(
				(p: ProveedorType) => p.codigo === producto.codigo
			) as ProveedorType
		);
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;
	if (isError) return <ErrorLayout error='No se pudo cargar los datos' />;

	return (
		<>
			<Content>
				<Toolbar
					title='Proveedores'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(q: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: q })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						headers={{
							nombre: 'Nombre',
							direccion: 'Direccion',
							telefono: 'Telefono',
							nit: 'Nit',
						}}
						rows={data.rows || []}
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
				<FormProveedor proveedor={proveedor} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Proveedor;
