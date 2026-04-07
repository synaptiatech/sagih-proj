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

const TipoPago = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [tipo, setTipo] = useState<TiposType>({} as TiposType);
	const [items, setItems] = useState<ItemList[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.pago}/all`,
		table: 'tipo_pago',
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
		dispatch({
			type: dataType.SET_CURRENT_PAGE,
			payload: p,
		});
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
				data.rows.map((tipo: TiposType) => {
					return {
						id: tipo.codigo,
						name: tipo.nombre,
						description: {
							primary: tipo.descripcion,
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

	const onDownload = async () => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Tipos de pago',
				table: 'tipo_pago',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'CODIGO',
					nombre: 'NOMBRE',
					descripcion: 'DESCRIPCION',
				},
			});
			downloadFileByBloodPart(data, 'Tipos de pago');
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
					path: URI.pago,
					params: {
						codigo: codigo,
					},
				});
			} catch (error) {
				handleError('Error al eliminar el tipo de pago', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (codigo: number) => {
		setTipo(
			state.data.find(
				(tipo: TiposType) => tipo.codigo === codigo
			) as TiposType
		);
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Tipos de pago'
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<AsList items={items} onDelete={onDelete} onEdit={onEdit} />
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
					title='Formulario de tipos de pago'
					onClose={onClose}
					tipo={tipo}
					endpoint={URI.pago}
				/>
			</MiModal>
		</>
	);
};

export default TipoPago;
