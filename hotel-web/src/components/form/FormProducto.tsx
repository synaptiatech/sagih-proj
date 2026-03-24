import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../consts/Uri';
import {
	ProveedorProps,
	ProveedorType,
	defaultProveedor,
	schemaProveedor,
} from '../../props/ProductoProps';
import { dataPost, dataUpdate } from '../../services/fetching.service';
import { gridStyle } from '../../theme/FormStyle';
import { handleError } from '../../utils/HandleError';
import FormActions from '../show/FormActions';
import swal from 'sweetalert';

const FormProveedor = ({ proveedor, onClose, ...props }: ProveedorProps) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<ProveedorType>({
		defaultValues: defaultProveedor,
		resolver: yupResolver(schemaProveedor),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<ProveedorType> = async (data) => {
		try {
			if (proveedor?.codigo === undefined)
				await dataPost({ path: URI.producto, data });
			else
				await dataUpdate({
					path: URI.producto,
					data,
					params: { codigo: proveedor?.codigo },
				});
			swal(
				'Guardado!',
				'Se ha guardado el registro correctamente',
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
						p: 2,
					}}>
					<Typography variant='h6' component='h2'>
						Formulario proveedor
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							name='nombre'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									sx={{ flexGrow: 1 }}
									label='Nombre'
									error={!!errors.nombre}
									helperText={
										errors.nombre
											? errors.nombre?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<Controller
						name='direccion'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Direccion'
								error={!!errors.direccion}
								helperText={
									errors.direccion
										? errors.direccion?.message
										: ''
								}
							/>
						)}
					/>
					<Controller
						name='telefono'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Telefono'
								error={!!errors.telefono}
								helperText={
									errors.telefono
										? errors.telefono?.message
										: ''
								}
							/>
						)}
					/>
					<Controller
						name='nit'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label='Nit'
								error={!!errors.nit}
								helperText={
									errors.nit ? errors.nit?.message : ''
								}
							/>
						)}
					/>
					<FormActions
						isNew={proveedor?.codigo !== undefined}
						onBack={onClose}
						onDelete={() => {}}
					/>
				</Card>
			</form>
		</Box>
	);
};

export default FormProveedor;
