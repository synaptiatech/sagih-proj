import { Autocomplete, TextField } from '@mui/material';
import React, { useContext } from 'react';
import { URI } from '../../../consts/Uri';
import { TransactContext } from '../../../contexts/TransactProvider';
import { transactTypes } from '../../../hooks/transactReducer';
import { useFetch } from '../../../hooks/useFetch';
import { VendedorType } from '../../../props/VendedorProps';
import { TextOnlyRead } from '../../input/Input';

export type PickVendedorProps = {
	readOnly?: boolean;
};

const PickVendedor: React.FC<PickVendedorProps> = ({ readOnly = false }) => {
	const { state, dispatch } = useContext(TransactContext);

	const { data, isLoading, error } = useFetch({
		path: `${URI.vendedor}/all`,
		table: 'vendedor',
		sort: { nombre: 'ASC' },
		columns: {
			codigo: 'Código',
			nombre: 'Nombre',
		},
	});

	const onVendedorChange = (item: VendedorType) => {
		dispatch({
			type: transactTypes.SET_VENDEDOR,
			payload: item,
		});
	};

	if (isLoading) return <p>Cargando vendedores...</p>;
	if (error) return <p>Error al cargar vendedores</p>;

	if (readOnly)
		return (
			<TextOnlyRead
				label='Vendedor'
				value={state.tranEncabezado.vendedor}
				type='text'
				name='vendedor'
			/>
		);

	return (
		<>
			<Autocomplete
				sx={{ width: 200 }}
				options={data?.rows || []}
				value={
					state.tranEncabezado.vendedor
						? data.rows.find((v: VendedorType) => {
								return (
									v.codigo === state.tranEncabezado.vendedor
								);
						  }) ?? null
						: null
				}
				getOptionLabel={(option: VendedorType) => option.nombre}
				onChange={(_event, newValue) => {
					onVendedorChange(
						data.rows.find(
							(item: VendedorType) =>
								item.codigo === newValue?.codigo
						) || ({} as VendedorType)
					);
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Vendedor'
						variant='standard'
					/>
				)}
			/>
		</>
	);
};

export default PickVendedor;
