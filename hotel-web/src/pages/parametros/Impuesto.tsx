import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormImpuesto from '../../components/form/FormImpuesto';
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
import { ImpuestoType } from '../../props/ImpuestoProps';
import { ItemList } from '../../props/ShowProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Impuesto = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [impuesto, setImpuesto] = useState<ImpuestoType>({} as ImpuestoType);
	const [items, setItems] = useState<ItemList[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.impuesto}/all`,
		table: 'impuestos',
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
			porcentaje: 'Porcentaje',
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
		setImpuesto({} as ImpuestoType);
		refetch();
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: dataType.SET_METADATA,
				payload: data,
			});
			setItems(
				data.rows.map((item: ImpuestoType) => {
					return {
						id: item.codigo,
						name: item.nombre,
						description: {
							primary: `${item.porcentaje} %`,
							secondary: `${item.porcentaje / 100}`,
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
				name: 'Impuestos',
				table: 'impuestos',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'CODIGO',
					nombre: 'NOMBRE',
					porcentaje: 'PORCENTAJE',
				},
			});
			downloadFileByBloodPart(data, 'Impuestos');
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
					path: URI.impuesto,
					params: { codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el impuesto', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (codigo: number) => {
		setImpuesto(
			state.data.find(
				(item: ImpuestoType) => item.codigo === codigo
			) as ImpuestoType
		);
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Impuestos'
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
				<FormImpuesto impuesto={impuesto} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Impuesto;
