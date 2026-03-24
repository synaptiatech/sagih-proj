import { yupResolver } from '@hookform/resolvers/yup';
import {
	Box,
	Card,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import {
	ServicioProps,
	ServicioType,
	schemaServicio,
} from '../../props/ServicioProps';
import { TiposType } from '../../props/Tipos';
import {
	dataDelete,
	dataPost,
	dataUpdate,
} from '../../services/fetching.service';
import { gridStyle } from '../../theme/FormStyle';
import { handleError } from '../../utils/HandleError';
import { MiAutocomplete } from '../Autocomplete';
import ErrorLayout from '../layout/error';
import GridSkeleton from '../layout/waiting';
import FormActions from '../show/FormActions';

const FormServicio = ({ servicio, onClose, ...props }: ServicioProps) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<ServicioType>({
		defaultValues: {
			codigo: servicio?.codigo || 0,
			nombre: servicio?.nombre || '',
			descripcion: servicio?.descripcion || '',
			precio_unitario:
				+`${servicio?.precio_unitario}`.replace('Q. ', '') || 0,
			precio_mayorista:
				+`${servicio?.precio_mayorista}`.replace('Q. ', '') || 0,
			tipo: servicio?.tipo || 0,
		},
		resolver: yupResolver(schemaServicio),
		mode: 'onBlur',
	});
	const {
		data: sTypes,
		isLoading,
		isError,
	} = useFetch({
		path: `${URI.servicio.tipo}/all`,
		table: 'tipo_servicio',
	});

	const onSubmit: SubmitHandler<ServicioType> = async (data) => {
		try {
			if (servicio?.codigo === undefined)
				await dataPost({ path: URI.servicio._, data });
			else
				await dataUpdate({
					path: URI.servicio._,
					data,
					params: { codigo: servicio?.codigo },
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
				path: URI.servicio._,
				params: { codigo: servicio?.codigo },
			});
		} catch (error) {
			sweetAlert({
				title: 'Error',
				text: 'No se pudo eliminar el servicio',
				icon: 'error',
				timer: 3000,
			});
		}
	};

	if (isLoading) return <GridSkeleton />;
	if (isError) return <ErrorLayout error='No se pudo cargar un parámetro' />;

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
						Formulario servicio
					</Typography>
					<Box sx={gridStyle}>
						<MiAutocomplete
							control={control as any}
							name='tipo'
							options={sTypes.rows.map((item: TiposType) => ({
								id: item.codigo,
								label: item.nombre,
							}))}
							placeholder='Tipo de servicio'
						/>
						<Controller
							name='nombre'
							control={control}
							rules={{ required: true, maxLength: 30 }}
							render={({ field }) => (
								<TextField
									{...field}
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
							name='precio_unitario'
							control={control}
							rules={{ required: true, min: 0 }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Precio unitario'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												Q.
											</InputAdornment>
										),
									}}
									error={!!errors.precio_unitario}
									helperText={
										errors.precio_unitario
											? errors.precio_unitario?.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='precio_mayorista'
							control={control}
							rules={{ required: true, min: 0 }}
							render={({ field }) => (
								<TextField
									{...field}
									label='Precio mayorista'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												Q.
											</InputAdornment>
										),
									}}
									error={!!errors.precio_mayorista}
									helperText={
										errors.precio_mayorista
											? errors.precio_mayorista?.message
											: ''
									}
								/>
							)}
						/>
					</Box>
					<Controller
						name='descripcion'
						control={control}
						rules={{ required: true, maxLength: 100 }}
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
					<FormActions
						isNew={servicio?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormServicio;
