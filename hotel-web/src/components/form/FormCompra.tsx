import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { URI } from '../../consts/Uri';
import { ComprasContext } from '../../contexts/ComprasProvider';
import { CompraType, schemaCompra } from '../../props/CompraProps';
import { dataPost, dataUpdate } from '../../services/fetching.service';
import { formatDateToInput, switchDateToEng } from '../../utils/Formateo';
import { handleError } from '../../utils/HandleError';
import { PickProveedor } from '../compras/PickProveedor';
import { FormInput } from '../input/FormInput';
import dayjs from 'dayjs';

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
			fecha: state.compras.fecha
				? dayjs(
						state?.compras?.fecha,
						'YYYY-MM-DDThh:mm:ss.SSSZ'
				  ).format('YYYY-MM-DD hh:mm')
				: dayjs().format('YYYY-MM-DD hh:mm'),
			// formatDateToInput({
			// 	date: state.compras.fecha
			// 		? new Date(switchDateToEng(state.compras.fecha))
			// 		: new Date(),
			// })
			descripcion: state?.compras?.descripcion || '',
			proveedor: state?.compras?.proveedor || 0,
			total: state.compras.total
				? Number(
						state?.compras?.total
							.toString()
							.replace('Q. ', '')
							.replace(',', '')
				  )
				: 0,
			iva: state.compras.iva
				? Number(
						state?.compras?.iva
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
			console.log({ data, compras: state.compras });
			if (state.compras.codigo != undefined) {
				console.log('Update :', {
					...data,
					proveedor: state.compras.proveedor,
				});
				await dataUpdate({
					path: URI.compra,
					params: {
						codigo: state.compras.codigo,
					},
					data: {
						...data,
						proveedor: state.compras.proveedor,
						fecha: dayjs(data.fecha, 'YYYY-MM-DDTHH:mm').format(
							'YYYY-MM-DDTHH:mm'
						),
					},
				});
			} else {
				console.log('Create :', data);
				await dataPost({
					path: URI.compra,
					data: {
						...data,
						proveedor: state.compras.proveedor,
					},
				});
			}
			swal(
				'Compra guardada',
				'La compra se guardo correctamente',
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};

	return (
		<Box sx={{}}>
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
						{/* TITRAN */}
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
						{/* SERIE */}
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
						{/* FECHA */}
						<FormInput
							control={control as any}
							name='fecha'
							label='Fecha de compra'
							type='datetime-local'
							customOnChange={(value) => {
								console.log('e :', value);
								setValue('fecha', value);
							}}
						/>
						{/* PROVEEDOR */}
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
						{/* DESCRIPCION */}
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
						{/* TOTAL */}
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
						{/* IVA */}
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
