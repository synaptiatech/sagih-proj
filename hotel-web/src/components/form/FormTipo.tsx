import { Box, Card, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TiposType, TiposProps, schemaTipos } from '../../props/Tipos';
import { yupResolver } from '@hookform/resolvers/yup';
import {
	dataDelete,
	dataPost,
	dataUpdate,
} from '../../services/fetching.service';
import FormActions from '../show/FormActions';
import { handleError } from '../../utils/HandleError';
import { gridStyle } from '../../theme/FormStyle';
import { toCapitalCase } from '../../utils/Formateo';

const FormTipo = ({
	tipo,
	title,
	endpoint,
	onClose,
	onDownload = undefined,
	...props
}: TiposProps) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TiposType>({
		defaultValues: {
			codigo: tipo?.codigo || 0,
			nombre: tipo?.nombre || '',
			descripcion: tipo?.descripcion || '',
		},
		mode: 'onBlur',
		resolver: yupResolver(schemaTipos),
	});

	const onSubmit: SubmitHandler<TiposType> = async (data) => {
		try {
			if (tipo?.codigo === undefined)
				await dataPost({ path: endpoint, data });
			else
				await dataUpdate({
					path: endpoint,
					data,
					params: { codigo: tipo?.codigo },
				});
			reset();
			onClose();
		} catch (error) {
			handleError('No se pudo guardar el registro', error);
		}
	};

	const onDelete = async () => {
		try {
			await dataDelete({
				path: endpoint,
				params: { codigo: tipo?.codigo || 0 },
			});
		} catch (error) {
			handleError('No se pudo eliminar el registro', error);
		}
	};

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
					<Typography variant='h6' component='h2'>
						{title}
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							name='nombre'
							control={control}
							defaultValue=''
							render={({ field }) => (
								<TextField
									{...field}
									type='text'
									label='Nombre'
									variant='standard'
									onChange={(e) => {
										e.target.value = toCapitalCase(
											e.target.value
										);
										field.onChange(e);
									}}
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
							name='descripcion'
							control={control}
							defaultValue=''
							render={({ field }) => (
								<TextField
									{...field}
									type='text'
									label='Descripción'
									variant='standard'
									onChange={(e) => {
										e.target.value = toCapitalCase(
											e.target.value
										);
										field.onChange(e);
									}}
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
						isNew={tipo?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormTipo;
