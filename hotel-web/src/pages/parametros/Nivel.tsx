import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormTipo from '../../components/form/FormTipo';
import ErrorLayout from '../../components/layout/error';
import Loader from '../../components/layout/loader';
import GridSkeleton from '../../components/layout/waiting';
import Paginacion from '../../components/paginacion/Paginacion';
import { AsList } from '../../components/show/List';
import MiModal from '../../components/show/MiModal';
import { Toolbar } from '../../components/show/Toolbar';
import { URI } from '../../consts/Uri';
import { dataDefault, dataReducer, dataType } from '../../hooks/dataReducer';
import { useFetch } from '../../hooks/useFetch';
import { ItemList } from '../../props/ShowProps';
import { TiposType } from '../../props/Tipos';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Nivel = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [nivel, setNivel] = useState<TiposType>({} as TiposType);
	const [items, setItems] = useState<ItemList[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.habitacion.nivel}/all`,
		table: 'nivel',
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
			descripcion: 'Descripción',
		},
		pageNumber: state.currentPage,
		pageSize: state.limit,
		q: state.q,
	});

	const handleChange = (event: ChangeEvent<unknown>, p: number) =>
		dispatch({ type: dataType.SET_CURRENT_PAGE, payload: p });

	const onClose = () => {
		setOpenModal(false);
		setNivel({} as TiposType);
		refetch();
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: dataType.SET_METADATA,
				payload: data,
			});
			setItems(
				data.rows.map((item: TiposType) => {
					return {
						id: item.codigo,
						name: item.nombre,
						description: {
							primary: item.descripcion,
							secondary: '',
						},
					};
				})
			);
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
				name: 'Nivel',
				table: 'nivel',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					descripcion: 'Descripción',
				},
			});
			downloadFileByBloodPart(data, 'Niveles');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (codigo: number) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Nivel',
				table: 'v_habitacion',
				sort: { nivel: 'ASC', codigo: 'ASC' },
				where: { nivel: codigo },
				masterColumns: {
					nivel: 'Codigo',
					n_nombre: 'Nombre',
				},
				detailColumns: {
					codigo: 'Código',
					nombre: 'Nombre',
					descripcion: 'Descripción',
					precio: 'Precio',
					estado: 'Estado',
					n_nombre: 'Nivel',
					a_nombre: 'Área',
				},
			});
			downloadFileByBloodPart(data, 'Tipos de habitación');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (codigo: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.habitacion.nivel,
					params: { codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el nivel', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (id: number) => {
		setNivel(
			state.data.find(
				(item: TiposType) => item.codigo === id
			) as TiposType
		);
		setOpenModal(true);
	};

	if (isLoading) <GridSkeleton />;

	if (error) <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Nivel'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<AsList
						items={items}
						onDelete={onDelete}
						onEdit={onEdit}
						onDownload={onDownloadOne}
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
				<FormTipo
					title='Nivel'
					onClose={onClose}
					tipo={nivel}
					endpoint={URI.habitacion.nivel}
				/>
			</MiModal>
		</>
	);
};

export default Nivel;
