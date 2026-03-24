import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormHabitacion from '../../components/form/FormHabitacion';
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
import { HabitacionType } from '../../props/HabitacionProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Habitacion = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [habitacion, setHabitacion] = useState<HabitacionType>(
		{} as HabitacionType
	);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.habitacion._}/all`,
		table: 'v_habitacion',
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
		setHabitacion({} as HabitacionType);
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

	const onDownload = async (): Promise<void> => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Habitaciones',
				table: 'v_habitacion',
				sort: { codigo: 'ASC' },
				columns: {
					nombre: 'HABITACION',
					precio: 'PRECIO',
					estado: 'ESTADO',
					n_nombre: 'NIVEL',
					a_nombre: 'AREA',
					th_nombre: 'TIPO',
				},
			});
			downloadFileByBloodPart(data, 'Habitaciones');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (habitacion: any) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/parametrizado`,
				name: 'Habitación',
				table: 'v_habitacion',
				sort: { codigo: 'ASC' },
				columns: {
					nombre: 'HABITACION',
					precio: 'PRECIO',
					estado: 'ESTADO',
					n_nombre: 'NIVEL',
					a_nombre: 'AREA',
					th_nombre: 'TIPO',
				},
				customWhere: [
					{
						columna: 'codigo',
						relacion: '=',
						valor: habitacion.codigo,
					},
				],
			});
			downloadFileByBloodPart(data, 'Habitación');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async (habitacion: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.habitacion._,
					params: { codigo: habitacion.codigo },
				});
			} catch (error) {
				handleError('No se pudo eliminar la habitación', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (habitacion: any, index: number) => {
		setHabitacion(
			state.data.find(
				(h: HabitacionType) => h.codigo === habitacion.codigo
			)
		);
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Habitación'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						headers={{
							nombre: 'Nombre',
							descripcion: 'Descripción',
							a_nombre: 'Area',
							th_nombre: 'Tipo',
							n_nombre: 'Nivel',
							estado: 'Estado',
							precio: 'Precio',
						}}
						rows={data?.rows || []}
						onEdit={onEdit}
						onDelete={onDelete}
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
			<MiModal open={openModal} onClose={onClose} size='medium'>
				<FormHabitacion habitacion={habitacion} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Habitacion;
