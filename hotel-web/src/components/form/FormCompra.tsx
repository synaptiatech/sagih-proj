import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import dayjs from 'dayjs';

import { URI } from '../../consts/Uri';
import { ComprasContext } from '../../contexts/ComprasProvider';
import { CompraType, schemaCompra } from '../../props/CompraProps';
import { dataPost, dataUpdate } from '../../services/fetching.service';
import { handleError } from '../../utils/HandleError';
import { PickProveedor } from '../compras/PickProveedor';
import { FormInput } from '../input/FormInput';

const toDatetimeLocal = (value?: string | Date | null) => {
	if (!value) return dayjs().format('YYYY-MM-DDTHH:mm');

	const parsed = dayjs(value);
	if (parsed.isValid()) {
		return parsed.format('YYYY-MM-DDTHH:mm');
	}

	return dayjs().format('YYYY-MM-DDTHH:mm');
};

const FormCompra = ({ onClose }: { onClose: () => void }) => {
	const { state, dispatch } = useContext(ComprasContext);

	const {
		control,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<CompraType>({
		defaultValues: {
			serie: state?.compras?.serie || '',
			tipo_transaccion: state?.correlativo?.tipo_transaccion || '',
			documento: state?.compras?.documento || 0,
			fecha: toDatetimeLocal(state?.compras?.fecha),
			descripcion: state?.compras?.descripcion || '',
			proveedor: state?.compras?.proveedor || 0,
			total: state?.compras?.total
				? Number(
						state.compras.total
							.toString()
							.replace('Q. ', '')
							.replace(',', '')
				  )
				: 0,
			iva: state?.compras?.iva
				? Number(
						state.compras.iva
							.toString()
							.replace('Q. ', '')
							.replace(',', '')
				  )
				: 0,
		},
		resolver: yupResolver(schemaCompra),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<CompraType> = async (data) => {
		try {
			const fechaNormalizada =
				typeof data.fecha === 'string' && data.fecha.trim() !== ''
					? dayjs(data.fecha).format('YYYY-MM-DDTHH:mm')
					: dayjs().format('YYYY-MM-DDTHH:mm');

			if (state.compras.codigo !== undefined) {
				await dataUpdate({
					path: URI.compra,
					params: {
						codigo: state.compras.codigo,
					},
					data: {
						...data,
						proveedor: state.compras.proveedor,
						fecha: fechaNormalizada,
					},
				});
			} else {
				await dataPost({
					path: URI.compra,
					data: {
						...data,
						proveedor: state.compras.proveedor,
						fecha: fechaNormalizada,
					},
				});
			}

			swal(
				'Compra guardada',
				'La compra se guardó correctamente',
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						padding: 2,
						width: '100%',
					}}>
					<Typography>Formulario de compras</Typography>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns:
								'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
							placeContent: 'center',
							placeSelf: 'center',
							placeItems: 'flex-end',
							width: '100%',
							gap: 2,
						}}>
						<Controller
							control={control}
							name='tipo_transaccion'
							render={({ field }) => (
								<TextField
									{...field}
									label='Tipo'
									variant='standard'
								/>
							)}
						/>

						<Controller
							control={control}
							name='serie'
							render={({ field }) => (
								<TextField
									{...field}
									label='Serie'
									variant='standard'
								/>
							)}
						/>

						<Controller
							control={control}
							name='documento'
							render={({ field }) => (
								<TextField
									{...field}
									label='Documento'
									variant='standard'
								/>
							)}
						/>

						<FormInput
							control={control as any}
							name='fecha'
							label='Fecha de compra'
							type='datetime-local'
							customOnChange={(value) => {
								setValue('fecha', value);
							}}
						/>

						<PickProveedor />

						<TextField
							label='Direccion'
							variant='standard'
							value={state?.compras?.direccion || ''}
							inputProps={{
								readOnly: true,
							}}
						/>

						<TextField
							label='Telefono'
							variant='standard'
							value={state?.compras?.telefono || ''}
							inputProps={{
								readOnly: true,
							}}
						/>

						<TextField
							label='NIT'
							variant='standard'
							value={state?.compras?.nit || ''}
							inputProps={{
								readOnly: true,
							}}
						/>

						<Controller
							control={control}
							name='descripcion'
							render={({ field }) => (
								<TextField
									{...field}
									label='Descripción'
									variant='standard'
									error={!!errors.descripcion}
									helperText={
										errors.descripcion?.message || ''
									}
								/>
							)}
						/>

						<Controller
							control={control}
							name='total'
							render={({ field }) => (
								<TextField
									{...field}
									label='Total'
									variant='standard'
									onBlur={(e) => {
										setValue(
											'iva',
											Number(
												parseFloat(
													`${+e.target.value / 1.12}`
												).toFixed(2)
											)
										);
									}}
									InputProps={{
										startAdornment: (
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													width: '50px',
												}}>
												Q.
											</Box>
										),
									}}
									error={!!errors.total}
									helperText={errors.total?.message || ''}
								/>
							)}
						/>

						<Controller
							control={control}
							name='iva'
							render={({ field }) => (
								<TextField
									{...field}
									label='Iva'
									variant='standard'
									InputProps={{
										startAdornment: (
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													width: '50px',
												}}>
												Q.
											</Box>
										),
										readOnly: true,
									}}
									error={!!errors.iva}
									helperText={errors.iva?.message || ''}
								/>
							)}
						/>

						<Button
							variant='contained'
							color='primary'
							type='submit'
							fullWidth>
							Guardar
						</Button>
					</Box>
				</Card>
			</form>
		</Box>
	);
};

export default FormCompra;
