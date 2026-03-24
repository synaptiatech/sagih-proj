import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormPais from '../../components/form/FormPais';
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
import { PaisType } from '../../props/PaisProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Pais = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [pais, setPais] = useState<PaisType>({} as PaisType);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.pais}/all`,
		table: 'pais',
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
			iso2: 'Iso 2',
			descripcion: 'Descripción',
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
		setPais({} as PaisType);
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
				name: 'Paises',
				table: 'pais',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					iso2: 'Iso 2',
					descripcion: 'Descripción',
				},
			});
			downloadFileByBloodPart(data, 'Paises');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = (pais: any) => console.log('downloading', pais);

	const onDelete = async (pais: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.pais,
					params: { codigo: pais.codigo },
				});
			} catch (error) {
				handleError('No se pudo eliminar el registro', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (pais: any, index: number) => {
		setPais(
			state.data.find(
				(p: PaisType) => p.codigo === pais.codigo
			) as PaisType
		);
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='País'
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
							iso2: 'Iso 2',
							descripcion: 'Descripción',
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
				<FormPais pais={pais} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Pais;
