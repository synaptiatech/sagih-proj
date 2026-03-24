import React, { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import { URI } from '../../../consts/Uri';
import { dataDefault, dataReducer, dataType } from '../../../hooks/dataReducer';
import { VendedorType } from '../../../models/Vendedor';
import GridSkeleton from '../../../components/layout/waiting';
import ErrorLayout from '../../../components/layout/error';
import { Content } from '../../../components/card/Content';
import { Toolbar } from '../../../components/show/Toolbar';
import { Box } from '@mui/material';
import MiTabla from '../../../components/show/Table';
import Paginacion from '../../../components/paginacion/Paginacion';
import Loader from '../../../components/layout/loader';
import MiModal from '../../../components/show/MiModal';
import { FormVendedor } from '../../../components/form/FormVendedor';
import { handleDelete, handleError } from '../../../utils/HandleError';
import { dataDelete, downloadFile } from '../../../services/fetching.service';
import { downloadFileByBloodPart } from '../../../utils/DownloadFile';

export type VendedorProps = Record<string, never>;

const Vendedor: React.FC<VendedorProps> = ({}) => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [vendedor, setVendedor] = useState<VendedorType>({} as VendedorType);
	const [openForm, setOpenForm] = useState(false);
	const [waiting, setWaiting] = useState(false);

	const { data, isLoading, isError, refetch } = useFetch({
		path: `${URI.vendedor}/all`,
		table: 'vendedor',
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
		setVendedor({} as VendedorType);
		refetch();
	};

	const onCreate = () => setOpenForm(true);

	const onDownload = async () => {
		try {
			setWaiting(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Vendedor',
				table: 'vendedor',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					descripcion: 'Descripción',
					comision_venta: 'Comisión',
				},
			});
			downloadFileByBloodPart(data, 'Vendedores');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setWaiting(false);
		}
	};

	const onDownloadOne = (vendedor: any) => {};

	const onDelete = async (vendedor: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.vendedor,
					params: { codigo: vendedor.codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el registro', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = async (vendedor: any, index: number) => {
		setVendedor(
			state.data.find((v: VendedorType) => v.codigo === vendedor.codigo)
		);
		setOpenForm(true);
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
	if (isError) return <ErrorLayout error='No se pudo cargar los datos' />;

	return (
		<>
			<Content>
				<Toolbar
					title={'Vendedores'}
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({
							type: dataType.SET_FILTER,
							payload: filter,
						})
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						rows={data?.rows || []}
						headers={{
							codigo: 'Código',
							nombre: 'Nombre',
							descripcion: 'Descripción',
							comision_venta: 'Comisión',
						}}
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
			{waiting && <Loader />}
			<MiModal size={'small'} open={openForm} onClose={onClose}>
				<FormVendedor vendedor={vendedor} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Vendedor;
