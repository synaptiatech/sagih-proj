import { Autocomplete, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { URI } from '../../../consts/Uri';
import { TransactContext } from '../../../contexts/TransactProvider';
import { comprasTypes } from '../../../hooks/correlativoReducer';
import { transactTypes } from '../../../hooks/transactReducer';
import { useFetch } from '../../../hooks/useFetch';
import { CorrelativoType } from '../../../props/CorrelativoProps';

export type PickCorrelativoProps = {
	titran: string;
	action: transactTypes | comprasTypes;
	siguiente: number;
	context?: React.Context<any>;
};

const PickCorrelativo: React.FC<PickCorrelativoProps> = ({
	titran,
	action,
	siguiente,
	context = TransactContext,
}) => {
	const { state, dispatch } = useContext(context);
	const [documento, setDocumento] = useState(siguiente);
	const { data, isLoading, isError } = useFetch({
		path: `${URI.transaccion}/correlativo/all`,
		table: 'correlativo',
		query: { tipo_transaccion: titran },
	});

	const onChangeCorrelativo = (correlativo: CorrelativoType) => {
		dispatch({
			type: action,
			payload: {
				tipo_transaccion: titran,
				serie: correlativo.serie,
				siguiente: correlativo.siguiente,
			},
		});
		setDocumento(correlativo.siguiente || 0);
	};

	const onChangeDocumento = (documento: string) => {
		setDocumento(Number(documento));
		dispatch({
			type: action,
			payload: { documento: documento },
		});
	};

	if (isLoading) return <p>Cargando correlativos...</p>;
	if (isError) return <p>Error al cargar correlativos</p>;

	return (
		<>
			<Autocomplete
				options={data?.rows || []}
				getOptionLabel={(option: CorrelativoType) => option.serie}
				onChange={(e, correlativo: any) =>
					onChangeCorrelativo(correlativo || ({} as CorrelativoType))
				}
				renderInput={(params) => (
					<TextField {...params} label='Serie' variant='standard' />
				)}
			/>
			<TextField
				sx={{ width: 75 }}
				label='Documento'
				variant='standard'
				value={documento || ''}
				onChange={(e) => onChangeDocumento(e.target.value)}
			/>
		</>
	);
};

export default PickCorrelativo;
