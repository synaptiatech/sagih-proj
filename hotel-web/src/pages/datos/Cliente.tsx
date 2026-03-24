import { Box } from '@mui/material';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { Content } from '../../components/card/Content';
import FormCliente from '../../components/form/FormCliente';
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
import { ClienteType } from '../../props/ClienteProps';
import { dataDelete, downloadFile } from '../../services/fetching.service';
import { downloadFileByBloodPart } from '../../utils/DownloadFile';
import { handleDelete, handleError } from '../../utils/HandleError';

const Cliente = () => {
	const [state, dispatch] = useReducer(dataReducer, dataDefault);
	const [cliente, setCliente] = useState<ClienteType>({} as ClienteType);
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const { data, error, isLoading, refetch } = useFetch({
		path: `${URI.cliente}/all`,
		table: 'v_cliente',
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
		setOpenModal(false);
		setCliente({} as ClienteType);
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
				name: 'Clientes',
				table: 'cliente',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					nombre_c: 'Nombre comercial',
					nit: 'Nit',
					telefono_celular: 'Telefono celular',
					saldo: 'Saldo',
				},
				sumatoria: { saldo: 'Saldo' },
			});
			console.log(data);
			downloadFileByBloodPart(data, 'Clientes');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDownloadOne = async (cliente: any) => {
		try {
			setLoading(true);
			const { data } = await downloadFile({
				path: `${URI.reporte}/parametrizado`,
				name: 'Clientes',
				table: 'cliente',
				sort: { codigo: 'ASC' },
				columns: {
					codigo: 'Código',
					nombre: 'Nombre',
					nombre_c: 'Nombre comercial',
					nit: 'Nit',
					telefono_celular: 'Telefono celular',
					saldo: 'Saldo',
				},
				customWhere: [
					{
						columna: 'codigo',
						relacion: '=',
						valor: cliente.codigo,
					},
				],
			});
			downloadFileByBloodPart(data, 'Cliente');
		} catch (error) {
			handleError('No se pudo descargar el archivo', error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = (cliente: any, index: number): void => {
		handleDelete(async () => {
			try {
				await dataDelete({
					path: URI.cliente,
					params: { codigo: cliente.codigo },
				});
			} catch (error) {
				handleError('Error al eliminar el registro', error);
			} finally {
				refetch();
			}
		});
	};

	const onEdit = (cliente: any, index: number) => {
		setCliente(
			state.data.find((c: ClienteType) => c.codigo === cliente.codigo)
		);
		setOpenModal(true);
	};

	if (isLoading) return <GridSkeleton />;

	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<>
			<Content>
				<Toolbar
					title='Cliente'
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
							nombre_c: 'Nombre comercial',
							nit: 'Nit',
							telefono_celular: 'Telefono celular',
							saldo: 'Saldo',
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
				<FormCliente
					cliente={cliente}
					setCliente={setCliente}
					onClose={onClose}
				/>
			</MiModal>
		</>
	);
};

export default Cliente;
