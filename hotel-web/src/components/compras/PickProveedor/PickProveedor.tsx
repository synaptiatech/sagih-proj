import React, { useContext, useState } from 'react';
import { ComprasContext } from '../../../contexts/ComprasProvider';
import { useFetch } from '../../../hooks/useFetch';
import { URI } from '../../../consts/Uri';
import { ProveedorType } from '../../../props/ProductoProps';
import { comprasTypes } from '../../../hooks/correlativoReducer';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';
import MiModal from '../../show/MiModal';
import FormProveedor from '../../form/FormProducto';

export type PickProveedorProps = Record<string, never>;

const PickProveedor: React.FC<PickProveedorProps> = ({}) => {
	const { state, dispatch } = useContext(ComprasContext);
	const [openModal, setOpenModal] = useState(false);
	const { data, isLoading, isError, refetch } = useFetch({
		path: `${URI.producto}/all`,
		table: 'proveedor',
		sort: { nombre: 'ASC' },
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
			direccion: 'Dirección',
			telefono: 'Teléfono',
			nit: 'NIT',
		},
	});

	const onChange = (item: ProveedorType) => {
		dispatch({
			type: comprasTypes.SET_COMPRAS,
			payload: {
				proveedor: item.codigo,
				telefono: item.telefono,
				nit: item.nit,
				direccion: item.direccion,
			},
		});
	};

	const onClose = () => {
		setOpenModal(false);
		refetch();
	};

	if (isLoading) return <p>Cargando proveedores...</p>;
	if (isError) return <p>Error al cargar proveedores</p>;

	return (
		<>
			<Autocomplete
				sx={{ width: 200 }}
				options={data?.rows || []}
				getOptionLabel={(option: ProveedorType) => option.nombre}
				value={data.rows.find(
					(p: ProveedorType) => p.nombre === state.compras.nombre
				)}
				onChange={(_event, newValue) => {
					onChange(
						data.rows.find(
							(item: ProveedorType) =>
								item.codigo === newValue?.codigo
						) || ({} as ProveedorType)
					);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Proveedor'
						variant='standard'
						InputProps={{
							...params.InputProps,
							startAdornment: (
								<IconButton onClick={() => setOpenModal(true)}>
									<Add />
								</IconButton>
							),
						}}
					/>
				)}
			/>
			{openModal && (
				<MiModal open={openModal} onClose={onClose} size='small'>
					<FormProveedor
						proveedor={{} as ProveedorType}
						onClose={onClose}
					/>
				</MiModal>
			)}
		</>
	);
};

export default PickProveedor;
