import { Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import { TranDetalleType } from '../../props/ReservaProps';
import FilasBox from '../../utils/FilasFlex';
import { TextOnlyRead } from '../input/Input';
import MiTabla from '../show/Table';
import TrancDetalle from './Detalle';

const formatearFecha = (fecha: string) => {
	const date = new Date(fecha);
	return `${date.getDate()}-${
		date.getMonth() + 1
	}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

const CheckInForm = () => {
	const { state, dispatch } = useContext(TransactContext);
	const [detalle, setDetalle] = useState<TranDetalleType>(
		{} as TranDetalleType
	);

	const { data, isLoading, error } = useFetch({
		path: `${URI.transaccion}/detalle/all`,
		table: 'detalle_transaccion',
		query: {
			serie: state.tranEncabezado.serie,
			documento: +state.tranEncabezado.documento,
			tipo_transaccion: state.tranEncabezado.tipo_transaccion,
		},
	});

	const editDetalle = (row: any, index: number): void => {
		setDetalle(row as TranDetalleType);
	};

	const deleteDetalle = (row: any, index: number): void => {
		console.log('Delete detalle', row);
		// dispatch({
		// 	type: transactTypes.DELETE_DETALLE,
		// 	payload: row as DetalleTransacType,
		// });
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: transactTypes.SET_DETALLE,
				payload: data?.rows || [],
			});
		}
	}, [data]);

	console.log({ state });

	if (isLoading) {
		return <div>Cargando detalle...</div>;
	}

	if (error) {
		return <div>Error al cargar detalle...</div>;
	}

	return (
		<>
			<Typography variant='h6' component='h2' my={2}>
				Check in
			</Typography>
			<FilasBox>
				<>
					<Typography variant='body1' component='h2' my={2}>
						Datos de transacción
					</Typography>
					<TextOnlyRead
						label='Transacción'
						value={state.tranEncabezado.tipo_transaccion}
					/>
					<TextOnlyRead
						label='Serie'
						value={state.tranEncabezado.serie}
					/>
					<TextOnlyRead
						label='Documento'
						value={state.tranEncabezado.documento}
					/>
					<TextOnlyRead
						label='Habitación'
						value={state.habitacion?.codigo || ''}
					/>
					<TextOnlyRead
						label='Vendedor'
						value={state.tranEncabezado?.nombre_vendedor || ''}
					/>
					<TextOnlyRead
						label='Número de personas'
						value={state.tranEncabezado.numero_personas}
					/>
					<TextOnlyRead
						label='Subtotal'
						value={state.tranEncabezado.subtotal}
					/>
				</>
			</FilasBox>
			<FilasBox>
				<>
					<Typography variant='body1' component='h2' my={2}>
						Datos de facturación
					</Typography>
					<TextOnlyRead
						label='Fecha de ingreso'
						value={formatearFecha(
							state.tranEncabezado.fecha_ingreso
						)}
					/>
					<TextOnlyRead
						label='Fecha de salida'
						value={formatearFecha(
							state.tranEncabezado.fecha_salida
						)}
					/>
					<TextOnlyRead
						label='Nombre'
						value={state.tranEncabezado.nombre_factura}
					/>
					<TextOnlyRead
						label='Nit'
						value={state.tranEncabezado.nit_factura}
					/>
					<TextOnlyRead
						label='Dirección'
						value={state.tranEncabezado.direccion_factura}
					/>
				</>
			</FilasBox>
			<FilasBox>
				<>
					<TrancDetalle
						detalle={detalle}
						clearDetalle={() => setDetalle({} as TranDetalleType)}
					/>
				</>
			</FilasBox>
			{state.operacion === 'CO' && (
				<FilasBox>
					<>
						<Typography variant='body1' component='h2' my={2}>
							Datos de pago
						</Typography>
					</>
				</FilasBox>
			)}
			<MiTabla
				headers={{
					descripcion: 'Descripción',
					cantidad: 'Cantidad',
					precio: 'Precio',
					subtotal: 'Subtotal',
				}}
				rows={state.tranEncabezado.detalle || []}
				sumatoria='subtotal'
				onEdit={editDetalle}
				onDelete={deleteDetalle}
				onDownload={() => {}}
			/>
		</>
	);
};

export default CheckInForm;
