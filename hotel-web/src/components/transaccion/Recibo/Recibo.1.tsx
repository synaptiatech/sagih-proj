import {
	Autocomplete,
	Button,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import swal from 'sweetalert';
import { URI } from '../../../consts/Uri';
import { TransactContext } from '../../../contexts/TransactProvider';
import { transactTypes } from '../../../hooks/transactReducer';
import { useFetch } from '../../../hooks/useFetch';
import { RCDetType } from '../../../props/ReciboProps';
import { TiposType } from '../../../props/Tipos';
import { dataPost, dataUpdate } from '../../../services/fetching.service';
import { ReciboProps } from './Recibo';

export const Recibo: React.FC<ReciboProps> = ({}) => {
	const { state, dispatch } = useContext(TransactContext);
	const [isEditing, setIsEditing] = useState(false);
	const [detalle, setDetalle] = useState<RCDetType>({} as RCDetType);

	const {
		data: pagos,
		isLoading,
		isError,
		refetch,
	} = useFetch({
		path: `${URI.pago}/all`,
		table: 'tipo_pago',
	});

	const onSave = async () => {
		if (
			!state.rcCorrelativo.serie ||
			!state.rcCorrelativo.tipo_transaccion ||
			!state.rcCorrelativo.siguiente ||
			!detalle.tipo_pago ||
			!detalle.descripcion ||
			!detalle.monto
		) {
			return;
		}

		if (detalle.codigo) {
			try {
				const { data } = await dataUpdate({
					path: `${URI.pago}`,
					data: {
						monto: detalle.monto,
						descripcion: detalle.descripcion,
						tipo_pago: detalle.tipo_pago,
					},
					params: { codigo: detalle.codigo },
				});
				if (data.length > 0) {
					swal(
						'Pago actualizado',
						'El pago ha sido actualizado, guarde la transacción para que el cambio se visualice',
						'success'
					);
					dispatch({
						type: transactTypes.UPDATE_RC_DETALLE,
						payload: data[0],
					});
				}
			} catch (error) {
				swal('Error', 'Error al actualizar el pago', 'error');
			}
		} else {
			dispatch({
				type: !isEditing
					? transactTypes.ADD_RC_DETALLE
					: transactTypes.UPDATE_RC_DETALLE,
				payload: detalle,
			});
		}
		setIsEditing(false);
		setDetalle({
			...rcDetInit,
		});
		refetch();
	};

	const onDelete = async () => {
		try {
			console.log('Eliminar pago', detalle);
			if (detalle.codigo !== undefined) {
				swal({
					title: '¿Está seguro?',
					text: 'Una vez eliminado, no se podrá recuperar el pago',
					icon: 'warning',
					buttons: ['Cancelar', 'Eliminar'],
					dangerMode: true,
				}).then(async (willDelete) => {
					if (!willDelete) return;

					const result = await dataPost({
						path: `${URI.pago}/delete`,
						data: {
							codigo: detalle.codigo,
							serie: detalle.serie,
							tipo_transaccion: detalle.tipo_transaccion,
							documento: detalle?.documento,
						},
					});
					console.log({ result });
					setIsEditing(false);
					setDetalle({} as RCDetType);
					swal(
						'Pago eliminado',
						'El pago ha sido eliminado',
						'success'
					);
					refetch();
				});
			} else {
				dispatch({
					type: transactTypes.REMOVE_RC_DETALLE,
					payload: detalle,
				});
				setIsEditing(false);
				setDetalle({} as RCDetType);
				swal('Pago eliminado', 'El pago ha sido eliminado', 'success');
				refetch();
			}
		} catch (error) {
			swal('Error', 'Error al eliminar el pago', 'error');
		}
	};

	const onCancel = () => {
		setIsEditing(false);
		setDetalle({} as RCDetType);
	};

	if (isLoading) return <div>Cargando tipos de pago...</div>;
	if (isError) return <div>Error al cargar tipos de pago</div>;

	return (
		<>
			<Autocomplete
				options={pagos?.rows || []}
				getOptionLabel={(option: TiposType) => option.nombre}
				onChange={(_event, value) => {
					setDetalle({
						...detalle,
						tipo_pago: value?.codigo || 0,
						n_tipo_pago: value?.nombre || '',
					});
				}}
				renderInput={(params) => (
					<TextField
						{...params}
						sx={{ width: 150 }}
						label='Tipo de pago'
						variant='standard'
						value={detalle.n_tipo_pago || ''}
					/>
				)}
			/>
			<TextField
				sx={{ width: 150 }}
				label='Descripción'
				variant='standard'
				value={detalle.descripcion || ''}
				onChange={(event) => {
					setDetalle({
						...detalle,
						descripcion: event.target.value,
					});
				}}
			/>
			<TextField
				sx={{ width: 150 }}
				label='Monto'
				variant='standard'
				type='number'
				value={detalle.monto || 0}
				onChange={(event) => {
					setDetalle({
						...detalle,
						monto: Number(event.target.value),
					});
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position='start'>Q</InputAdornment>
					),
				}}
			/>
			{isEditing && (
				<>
					<Button variant='text' color='secondary' onClick={onCancel}>
						Cancelar
					</Button>
					<Button variant='text' color='warning' onClick={onDelete}>
						Quitar pago
					</Button>
				</>
			)}
			<Button
				variant='outlined'
				color='primary'
				onClick={onSave}
				disabled={
					!state.rcCorrelativo.serie ||
					!state.rcCorrelativo.tipo_transaccion ||
					!state.rcCorrelativo.siguiente ||
					!detalle.tipo_pago ||
					!detalle.descripcion ||
					!detalle.monto
				}>
				{isEditing ? 'Guardar cambios' : 'Agregar pago'}
			</Button>
			{/* PAGOS */}
			<Typography sx={{ mt: 2, fontWeight: 'bold' }}>
				{`${new Intl.NumberFormat('es-GT', {
					style: 'currency',
					currency: 'GTQ',
				}).format(
					state.rcDetalle?.reduce(
						(acc, cur) =>
							acc + parseFloat(`${cur.monto}`.replace('Q. ', '')),
						0
					)
				)} / ${new Intl.NumberFormat('es-GT', {
					style: 'currency',
					currency: 'GTQ',
				}).format(
					state.tranDetalle?.reduce(
						(acc, cur) =>
							acc +
							parseFloat(`${cur.subtotal}`.replace('Q. ', '')),
						0
					)
				)}`}
			</Typography>
			{!isEditing && (
				<Autocomplete
					options={state.rcDetalle || []}
					getOptionLabel={(option: RCDetType) =>
						option?.descripcion || ''
					}
					onChange={(_event, value) => {
						setIsEditing(true);
						setDetalle(value || ({} as RCDetType));
						dispatch({
							type: transactTypes.SET_RC_CORRELATIVO,
							payload: {
								tipo_transaccion:
									value?.tipo_transaccion || 'RC',
								serie: value?.serie || '',
								documento: value?.documento || 0,
								siguiente: value?.documento || 0,
							},
						});
					}}
					renderInput={(params) => (
						<TextField
							{...params}
							sx={{ width: 200 }}
							label='Pagos realizados'
							variant='standard'
						/>
					)}
				/>
			)}
		</>
	);
};
