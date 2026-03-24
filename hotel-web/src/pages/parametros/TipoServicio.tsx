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

const TipoServicio = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [tipo, setTipo] = useState<TiposType>({} as TiposType);
	const [items, setItems] = useState<ItemList[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.servicio.tipo}/all`,
		table: 'tipo_servicio',
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
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
		setTipo({} as TiposType);
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
				name: 'Tipos de servicio',
				table: 'tipo_servicio',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'CODIGO',
					nombre: 'NOMBRE',
					descripcion: 'DESCRIPCION',
				},
			});
			downloadFileByBloodPart(data, 'Tipos de servicios');
		} catch (error) {
			handleError('Error al descargar el reporte', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (codigo: number) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Tipos de servicio',
				table: 'v_servicio',
				sort: { codigo: 'ASC' },
				where: { tipo: codigo },
				columns: {
					tipo: 'CODIGO',
					ts_nombre: 'NOMBRE',
					codigo: 'CODIGO',
					nombre: 'NOMBRE',
					descripcion: 'DESCRIPCION',
					precio_unitario: 'PRECIO',
				},
				masterColumns: {
					tipo: 'CODIGO',
					ts_nombre: 'NOMBRE',
				},
				detailColumns: {
					codigo: 'CODIGO',
					nombre: 'NOMBRE',
					descripcion: 'DESCRIPCION',
					precio_unitario: 'PRECIO',
				},
			});
			downloadFileByBloodPart(data, 'Tipos de servicios');
		} catch (error) {
			handleError('Error al descargar el reporte', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (codigo: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.servicio.tipo,
					params: { codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el tipo de servicio', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (codigo: number) => {
		setTipo(state.data.find((item: TiposType) => item.codigo === codigo));
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Tipo de servicios'
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
					title='Tipo de servicio'
					onClose={onClose}
					tipo={tipo}
					endpoint={URI.servicio.tipo}
				/>
			</MiModal>
		</>
	);
};

export default TipoServicio;
