import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../../consts/Uri';
import { VendedorType, schemaVendedor } from '../../../models/Vendedor';
import { dataPost, dataUpdate } from '../../../services/fetching.service';
import { gridStyle } from '../../../theme/FormStyle';
import { handleError } from '../../../utils/HandleError';
import FormActions from '../../show/FormActions';
import swal from 'sweetalert';

export type FormVendedorProps = {
	vendedor: VendedorType;
	onClose: () => void;
};

const FormVendedor: React.FC<FormVendedorProps> = ({ vendedor, onClose }) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<VendedorType>({
		defaultValues: {
			codigo: vendedor?.codigo || undefined,
			nombre: vendedor?.nombre || '',
			descripcion: vendedor?.descripcion || '',
			comision_venta: vendedor?.comision_venta || 0,
		},
		resolver: yupResolver(schemaVendedor),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<VendedorType> = async (data) => {
		try {
			if (vendedor.codigo === undefined) {
				await dataPost({
					path: URI.vendedor,
					data: {
						nombre: data.nombre,
						descripcion: data.descripcion,
						comision_venta: data.comision_venta,
					},
				});
			} else {
				await dataUpdate({
					path: URI.vendedor,
					data: {
						nombre: data.nombre,
						descripcion: data.descripcion,
						comision_venta: data.comision_venta,
					},
					params: {
						codigo: vendedor?.codigo,
					},
				});
			}
			swal(
				'¡Registro guardado correctamente!',
				'El registro se guardó correctamente',
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};

	const onDelete = () => {};

	const onPrint = () => {};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						p: 2,
					}}>
					<Typography variant='h6' component={'h2'}>
						Formulario vendedor
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							control={control}
							name='nombre'
							render={({ field }) => (
								<TextField
									{...field}
									label='Nombre'
									error={!!errors.nombre}
									helperText={errors.nombre?.message || ''}
								/>
							)}
						/>
						<Controller
							control={control}
							name='descripcion'
							render={({ field }) => (
								<TextField
									{...field}
									label='Descripción'
									error={!!errors.descripcion}
									helperText={
										errors.descripcion?.message || ''
									}
								/>
							)}
						/>
						<Controller
							control={control}
							name='comision_venta'
							render={({ field }) => (
								<TextField
									{...field}
									label='Comisión'
									error={!!errors.comision_venta}
									helperText={
										errors.comision_venta?.message || ''
									}
								/>
							)}
						/>
					</Box>
					<FormActions
						isNew={vendedor.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormVendedor;
