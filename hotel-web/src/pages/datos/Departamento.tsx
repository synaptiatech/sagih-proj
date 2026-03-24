import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormDepartamento from '../../components/form/FormDepartamento';
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
import { DepartamentoType } from '../../props/DepartamentoProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Departamento = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [departamento, setDepartamento] = useState<DepartamentoType>(
		{} as DepartamentoType
	);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.departamento}/all`,
		table: 'departamento',
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
			descripcion: 'Descripción',
			pais: 'Pais',
		},
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
		setDepartamento({} as DepartamentoType);
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
				name: 'Departamentos',
				table: 'Departamento',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					descripcion: 'Descripción',
				},
			});
			downloadFileByBloodPart(data, 'Departamentos');
		} catch (err) {
			handleError('No se pudo generar el reporte', err);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = (departamento: any) =>
		console.log('Descargando', departamento);

	const onDelete = async (departamento: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.departamento,
					params: { codigo: departamento.codigo },
				});
			} catch (err) {
				handleError('No se pudo eliminar el departamento', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (departamento: any, index: number) => {
		setDepartamento(
			state.data.find(
				(d: DepartamentoType) => d.codigo === departamento.codigo
			)
		);
		setOpenModal(true);
	};

	if (isLoading) <GridSkeleton />;

	if (error) <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Departamento'
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
							pais: 'Pais',
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
			<MiModal open={openModal} onClose={onClose} size='small'>
				<FormDepartamento
					departamento={departamento}
					onClose={onClose}
				/>
			</MiModal>
		</>
	);
};

export default Departamento;
