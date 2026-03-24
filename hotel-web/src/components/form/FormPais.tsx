import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../consts/Uri';
import { PaisProps, PaisType, schemaPais } from '../../props/PaisProps';
import { dataPost, dataUpdate } from '../../services/fetching.service';
import { gridStyle } from '../../theme/FormStyle';
import { handleError } from '../../utils/HandleError';
import FormActions from '../show/FormActions';

const FormPais = ({ pais, onClose, ...props }: PaisProps) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<PaisType>({
		defaultValues: {
			codigo: pais?.codigo || 0,
			nombre: pais?.nombre || '',
			iso2: pais?.iso2 || '',
			descripcion: pais?.descripcion || '',
		},
		resolver: yupResolver(schemaPais),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<PaisType> = async (data) => {
		try {
			if (pais?.codigo === undefined)
				await dataPost({ path: URI.pais, data });
			else
				await dataUpdate({
					path: URI.pais,
					data,
					params: { codigo: pais?.codigo },
				});
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};
	const onDelete = () => {
		console.log('Delete:', pais);
	};

	const onPrint = () => {
		console.log('Print:', pais);
	};

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
					<Typography variant='h6' component='h2'>
						Formulario pais
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
						<Controller
							name='iso2'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									sx={{ flexGrow: 1 }}
									label='Codigo ISO2'
									error={!!errors.iso2}
									helperText={
										errors.iso2 ? errors.iso2?.message : ''
									}
								/>
							)}
						/>
						<Controller
							name='descripcion'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Descripción'
									error={!!errors.descripcion}
									helperText={
										errors.descripcion
											? errors.descripcion?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<FormActions
						isNew={pais?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormPais;
