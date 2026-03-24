import { Autocomplete, IconButton, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { URI } from '../../../consts/Uri';
import { useFetch } from '../../../hooks/useFetch';
import { ClienteType } from '../../../props/ClienteProps';
import { TransactContext } from '../../../contexts/TransactProvider';
import { transactTypes } from '../../../hooks/transactReducer';
import { Add } from '@mui/icons-material';
import FormCliente from '../../form/FormCliente';
import MiModal from '../../show/MiModal';
import { TextOnlyRead } from '../../input/Input';
import userEvent from '@testing-library/user-event';

export type PickClienteProps = {
	readOnly?: boolean;
};

const PickCliente: React.FC<PickClienteProps> = ({ readOnly = false }) => {
	const { state, dispatch } = useContext(TransactContext);
	const [cliente, setCliente] = useState({} as ClienteType);
	const [openModal, setOpenModal] = useState(false);

	const {
		data: clientes,
		isLoading: isLoadingClientes,
		isError: isErrorClientes,
		refetch,
	} = useFetch({
		path: `${URI.cliente}/all`,
		table: 'cliente',
		sort: { nombre: 'ASC' },
		columns: {
			codigo: 'Código',
			nit: 'NIT',
			nombre: 'Nombre',
			direccion: 'Dirección',
			nit_factura: 'NIT factura',
			nombre_factura: 'Nombre factura',
			direccion_factura: 'Dirección factura',
		},
	});

	const onClientChange = (item: ClienteType) => {
		setCliente(item);
	};

	const onNitChange = (pickedNit: string) => {
		const nit = cliente.nit === pickedNit;

		if (nit) {
			dispatch({
				type: transactTypes.SET_CLIENTE,
				payload: {
					cliente: cliente.codigo,
					nombre_factura: cliente.nombre,
					direccion_factura: cliente.direccion,
					nit_factura: cliente.nit,
				},
			});
		} else {
			dispatch({
				type: transactTypes.SET_CLIENTE,
				payload: {
					cliente: cliente.codigo,
					nombre_factura: cliente.nombre_factura,
					direccion_factura: cliente.direccion_factura,
					nit_factura: cliente.nit_factura,
				},
			});
		}
	};

	const onClose = () => {
		setOpenModal(false);
		refetch();
	};

	useEffect(() => {
		if (clientes?.rows?.length > 0) {
			clientes.rows.find((item: ClienteType) => {
				if (item.codigo === state.tranEncabezado.cliente) {
					setCliente(item);
					return true;
				}
				return false;
			});
		}
	}, [clientes]);

	useEffect(() => {
		dispatch({
			type: transactTypes.SET_CLIENTE,
			payload: {
				cliente: cliente.codigo,
			},
		});
	}, [cliente]);

	if (isLoadingClientes) return <p>Cargando clientes...</p>;
	if (isErrorClientes) return <p>Error al cargar clientes</p>;

	if (readOnly)
		return (
			<>
				<TextOnlyRead
					label={'Cliente'}
					value={state.tranEncabezado.nombre_factura}
				/>
				{/* <TextOnlyRead
					label={'NIT'}
					value={state.tranEncabezado.nit_factura}
				/> */}
			</>
		);

	return (
		<>
			<Autocomplete
				sx={{ width: 200 }}
				options={clientes?.rows || []}
				value={
					cliente
						? clientes.rows.find((v: ClienteType) => {
								return v.codigo === cliente.codigo;
						  }) ?? null
						: null
				}
				getOptionLabel={(option: ClienteType) => option.nombre}
				renderOption={(props, option) => (
					<Typography {...props}>{option.nombre}</Typography>
				)}
				onChange={(_e, value) => {
					onClientChange(
						clientes.rows.find(
							(item: ClienteType) => item.codigo === value?.codigo
						) || {}
					);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='standard'
						label='Seleccionar cliente'
						InputProps={{
							...params.InputProps,
							startAdornment: (
								<IconButton
									type='button'
									onClick={() => setOpenModal(true)}>
									<Add />
								</IconButton>
							),
						}}
					/>
				)}
			/>
			<Autocomplete
				sx={{ width: 200 }}
				options={[cliente.nit, cliente.nit_factura] || []}
				value={
					cliente
						? cliente.nit === state.tranEncabezado.nit_factura
							? cliente.nit
							: cliente.nit_factura
						: ''
				}
				getOptionLabel={(option: string) => option}
				onChange={(_e, value) => {
					onNitChange(value || '');
				}}
				renderInput={(params) => (
					<TextField {...params} variant='standard' label='NIT' />
				)}
			/>
			{openModal && (
				<MiModal open={openModal} onClose={onClose} size='medium'>
					<FormCliente
						cliente={{} as ClienteType}
						setCliente={setCliente}
						onClose={onClose}
						onDelete={() => {}}
					/>
				</MiModal>
			)}
		</>
	);
};

export default PickCliente;
