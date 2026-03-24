import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import * as yup from 'yup';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { transactTypes } from '../../hooks/transactReducer';
import { useFetch } from '../../hooks/useFetch';
import { TranDetalleType } from '../../props/ReservaProps';
import { ServicioType } from '../../props/ServicioProps';
import { dataUpdate } from '../../services/fetching.service';
import { rowFlex } from '../../theme/FormStyle';
import { handleError } from '../../utils/HandleError';
import { MiAutocomplete } from '../Autocomplete';

interface DetalleProps {
	detalle: TranDetalleType;
	indice?: number;
	clearDetalle: () => void;
}

const schemaTranDet = yup.object().shape({
	servicio: yup.number().required('Servicio es requerido'),
	descripcion: yup.string().required('Descripción es requerida'),
	cantidad: yup
		.number()
		.required('Cantidad es requerida')
		.positive('Cantidad debe ser mayor a 0'),
	subtotal: yup
		.number()
		.required('Subtotal es requerido')
		.positive('Subtotal debe ser mayor a 0'),
});

const TrancDetalle = ({
	detalle,
	indice = undefined,
	clearDetalle,
}: DetalleProps) => {
	const { state, dispatch } = useContext(TransactContext);
	const {
		control,
		reset,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<TranDetalleType>({
		defaultValues: {
			codigo: detalle.codigo || undefined,
			servicio: detalle?.servicio || 0,
			descripcion: detalle?.descripcion || '',
			cantidad: detalle?.cantidad || 0,
			precio: +`${detalle?.precio || 0}`.replace(/['Q']['.']\s*/, ''),
			subtotal: +`${detalle?.subtotal || 0}`.replace(/['Q']['.']\s*/, ''),
		},
		resolver: yupResolver(schemaTranDet),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<TranDetalleType> = async (data) => {
		if (detalle.codigo) {
			try {
				if (detalle.codigo > 0) {
					const result = await dataUpdate({
						path: `${URI.transaccion}/detalle`,
						data: {
							cantidad: data.cantidad,
							descripcion: data.descripcion,
							precio: data.precio,
							servicio: data.servicio,
							subtotal: data.subtotal,
						},
						params: { codigo: detalle.codigo },
					});
					if (result.data.length === 0) {
						throw new Error('No se pudo actualizar el detalle');
					}
					detalle = result.data[0];
				}
				swal(
					'Detalle actualizado',
					'El detalle ha sido actualizado, los cambios se reflejan al cerrar este formulario',
					'success'
				);

				dispatch({
					type: transactTypes.UPDATE_TRAN_DETALLE,
					payload: {
						...detalle,
						siguiente:
							state.tranCorrelativo.documento ||
							state.tranCorrelativo.siguiente,
					},
				});
			} catch (error) {
				handleError('Error al actualizar el detalle', error);
			}
		} else {
			console.log(`Add new detalle:`, { ...data, codigo: -1 });
			dispatch({
				type: transactTypes.ADD_TRAN_DETALLE,
				payload: { ...data, codigo: -1 },
			});
		}
		reset();
		clearDetalle();
	};

	const {
		data: servicios,
		error,
		isLoading,
	} = useFetch({
		path: `${URI.servicio._}/all`,
		table: 'servicio',
	});

	const handleChangeServicio = (data: number | null) => {
		if (!data) return;
		const servicio = servicios?.rows.find(
			(s: ServicioType) => s.codigo === data
		);
		setValue('servicio', servicio.codigo || 0);
		setValue('descripcion', servicio.nombre || '');
		setValue('precio', servicio.precio_unitario || 0);
	};

	const handleChangeCantidad = (e: any) => {
		let cantidad = +e.target.value;

		setValue('cantidad', cantidad);
		setValue(
			'subtotal',
			cantidad *
				+getValues('precio')
					.toString()
					.replace(/['Q']['.']\s*/, '')
		);
	};

	const handleChangePrecio = (e: any) => {
		let precio = +e.target.value;

		setValue('precio', precio);
		setValue('subtotal', precio * +getValues('cantidad'));
	};

	useEffect(() => {
		if (detalle) {
			setValue('servicio', detalle.servicio);
			setValue('habitacion', detalle.habitacion);
			setValue('descripcion', detalle.descripcion);
			setValue('cantidad', detalle.cantidad);
			setValue('precio', detalle.precio);
			setValue('subtotal', detalle.subtotal);
		}
	}, [detalle]);

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>Error</p>;

	return (
		<>
			<Box sx={rowFlex}>
				<>
					<Typography>Detalle de la transacción</Typography>
					<Box sx={{ flex: 1 }} />
					<form onSubmit={handleSubmit(onSubmit)}>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<MiAutocomplete
								control={control as any}
								name='servicio'
								placeholder='Servicio'
								options={servicios?.rows
									.filter((s: ServicioType) => s.codigo !== 1)
									.map((s: ServicioType) => ({
										id: s.codigo,
										label: s.nombre,
									}))}
								customOnChange={handleChangeServicio}
							/>
							<Controller
								control={control}
								name='descripcion'
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ width: '150px' }}
										label='Descripción'
										variant='standard'
										InputLabelProps={{ shrink: true }}
										error={!!errors.descripcion}
										helperText={
											errors.descripcion
												? errors.descripcion?.message
												: ''
										}
									/>
								)}
							/>
							<Controller
								control={control}
								name='cantidad'
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ width: '90px' }}
										type='number'
										label='Cantidad'
										variant='standard'
										onChange={handleChangeCantidad}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							<Controller
								control={control}
								name='precio'
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ width: '90px' }}
										label='Precio'
										type='number'
										value={`${field.value}`.replace(
											/['Q']['.']\s*/,
											''
										)}
										variant='standard'
										onChange={handleChangePrecio}
										InputLabelProps={{ shrink: true }}
										InputProps={{
											startAdornment: 'Q.',
										}}
									/>
								)}
							/>
							<Controller
								control={control}
								name='subtotal'
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ width: '90px' }}
										label='Subtotal'
										variant='standard'
										value={`${field.value}`.replace(
											/['Q']['.']\s*/,
											''
										)}
										InputProps={{
											startAdornment: 'Q.',
										}}
										inputProps={{
											readOnly: true,
										}}
										InputLabelProps={{ shrink: true }}
									/>
								)}
							/>
							{detalle.codigo && (
								<Button
									variant='contained'
									color='warning'
									onClick={() => {
										clearDetalle();
										reset();
									}}>
									Cancelar
								</Button>
							)}
							<Button
								variant='outlined'
								color='primary'
								type='submit'>
								{detalle.codigo ? 'Actualizar' : 'Agregar'}
							</Button>
						</Box>
					</form>
				</>
			</Box>
		</>
	);
};

export default TrancDetalle;
