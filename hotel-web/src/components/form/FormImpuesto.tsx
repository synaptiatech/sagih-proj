import { Box, Card, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
	ImpuestoProps,
	ImpuestoType,
	schemaImpuesto,
} from '../../props/ImpuestoProps';
import { yupResolver } from '@hookform/resolvers/yup';
import { URI } from '../../consts/Uri';
import {
	dataDelete,
	dataPost,
	dataUpdate,
} from '../../services/fetching.service';
import FormActions from '../show/FormActions';
import { handleError } from '../../utils/HandleError';
import { gridStyle } from '../../theme/FormStyle';
import { toCapitalCase } from '../../utils/Formateo';

const FormImpuesto = ({ impuesto, onClose, ...props }: ImpuestoProps) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ImpuestoType>({
		defaultValues: {
			codigo: impuesto?.codigo || 0,
			nombre: impuesto?.nombre || '',
			porcentaje: impuesto?.porcentaje || 0,
		},
		resolver: yupResolver(schemaImpuesto),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<ImpuestoType> = async (data) => {
		try {
			if (impuesto?.codigo === undefined)
				await dataPost({ path: URI.impuesto, data });
			else
				await dataUpdate({
					path: URI.impuesto,
					data,
					params: { codigo: impuesto?.codigo },
				});
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};

	const onDelete = async () => {
		try {
			await dataDelete({
				path: URI.impuesto,
				params: { codigo: impuesto?.codigo || 0 },
			});
		} catch (error) {
			handleError('Error al eliminar el registro', error);
		}
	};

	const onPrint = () => {
		console.log('Print:', impuesto);
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						padding: 2,
					}}>
					<Typography variant='h6' component='h2'>
						Formulario impuesto
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							name='nombre'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Nombre'
									onChange={(e) => {
										/* Switch text to capital case */
										e.target.value = toCapitalCase(
											e.target.value
										);

										/* Set value to form */
										field.onChange(e);
									}}
									error={!!errors.nombre}
									helperText={
										errors.nombre
											? errors?.nombre?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='porcentaje'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Porcentaje'
									error={!!errors.porcentaje}
									helperText={
										errors.porcentaje
											? errors?.porcentaje?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<FormActions
						isNew={impuesto?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormImpuesto;
