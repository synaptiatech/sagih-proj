import { Box } from '@mui/material';
import React, { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../../components/card/Content';
import { FormCorrelativo } from '../../../components/form/FormCorrelativo';
import ErrorLayout from '../../../components/layout/error';
import Loader from '../../../components/layout/loader';
import GridSkeleton from '../../../components/layout/waiting';
import Paginacion from '../../../components/paginacion/Paginacion';
import MiModal from '../../../components/show/MiModal';
import MiTabla from '../../../components/show/Table';
import { URI } from '../../../consts/Uri';
import { dataDefault, dataReducer, dataType } from '../../../hooks/dataReducer';
import { useFetch } from '../../../hooks/useFetch';
import { CorrelativoType } from '../../../models/Correlativo';
import { dataDelete, downloadFile } from '../../../services/fetching.service';
import { downloadFileByBloodPart } from '../../../utils/DownloadFile';
import { handleDelete, handleError } from '../../../utils/HandleError';
import { Toolbar } from '../../../components/show/Toolbar';

export type CorrelativoProps = {};

const Correlativo: React.FC<CorrelativoProps> = ({}) => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [correlativo, setCorrelativo] = useState<CorrelativoType>(
		{} as CorrelativoType
	);
	const [openForm, setOpenForm] = useState(false);
	const [waiting, setWaiting] = useState(false);

	const { data, isLoading, isError, refetch } = useFetch({
		path: `${URI.vendedor}/all`,
		table: 'correlativo',
		sort: {
			tipo_transaccion: 'ASC',
			serie: 'ASC',
			siguiente: 'ASC',
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
		setOpenForm(false);
		setCorrelativo({} as CorrelativoType);
		refetch();
	};

	const onCreate = () => setOpenForm(true);

	const onDownload = async () => {
		try {
			setWaiting(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/master`,
				name: 'Correlativo',
				table: 'correlativo',
				sort: {
					tipo_transaccion: 'ASC',
					serie: 'ASC',
					siguiente: 'ASC',
				},
				columns: {
					serie: 'SERIE',
					tipo_transaccion: 'TIPO',
					siguiente: 'DOCUMENTO',
				},
			});
			downloadFileByBloodPart(data, 'Correlativo');
		} catch (error) {
			handleError('Error al descargar el archivo', error);
		} finally {
			setWaiting(false);
		}
	};

	const onDownloadOne = (correlativo: any) => {};

	const onDelete = (correlativo: any, index: number) => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.correlativo,
					params: {
						serie: correlativo.serie,
						tipo_transaccion: correlativo.tipo_transaccion,
					},
				});
				refetch();
			} catch (error) {
				handleError('Error al eliminar el registro', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (correlativo: any, index: number) => {
		setCorrelativo(
			state.data.find(
				(c: CorrelativoType) =>
					c.serie === correlativo.serie &&
					c.tipo_transaccion === correlativo.tipo_transaccion &&
					c.siguiente === correlativo.siguiente
			) as CorrelativoType
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
					title={'Correlativos'}
					onCreate={onCreate}
					onDownload={onDownload}
					onSearch={(filter: string) =>
						dispatch({ type: dataType.SET_FILTER, payload: filter })
					}
				/>
				<Box sx={{ mt: 3 }}>
					<MiTabla
						rows={data?.rows || []}
						headers={{
							serie: 'Serie',
							tipo_transaccion: 'Tipo',
							siguiente: 'Siguiente',
						}}
						onDelete={onDelete}
						onEdit={onEdit}
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
				<FormCorrelativo correlativo={correlativo} onClose={onClose} />
			</MiModal>
		</>
	);
};

export default Correlativo;
