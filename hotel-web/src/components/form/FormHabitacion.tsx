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
	HabitacionProps,
	HabitacionType,
	schemaHabitacion,
} from '../../props/HabitacionProps';
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

const FormHabitacion = ({ habitacion, onClose, ...props }: HabitacionProps) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<HabitacionType>({
		defaultValues: {
			codigo: habitacion?.codigo || 0,
			nombre: habitacion?.nombre || '',
			descripcion: habitacion?.descripcion || '',
			precio: +`${habitacion?.precio}`.replace('Q. ', '') || 0,
			tipo: habitacion?.tipo || 0,
			area: habitacion?.area || 0,
			nivel: habitacion?.nivel || 0,
		},
		resolver: yupResolver(schemaHabitacion),
		mode: 'onBlur',
	});
	const {
		data: floors,
		isLoading: isFloorLoading,
		isError: isFloorError,
	} = useFetch({
		path: `${URI.habitacion.nivel}/all`,
		table: 'nivel',
	});
	const {
		data: habTypes,
		isLoading: isHTypeLoading,
		isError: isHTypeError,
	} = useFetch({
		path: `${URI.habitacion.tipo}/all`,
		table: 'tipo_habitacion',
	});
	const {
		data: areas,
		isLoading: isAreaLoading,
		isError: isAreaError,
	} = useFetch({
		path: `${URI.habitacion.area}/all`,
		table: 'area',
	});

	const onSubmit: SubmitHandler<HabitacionType> = async (data) => {
		try {
			if (habitacion?.codigo === undefined)
				await dataPost({ path: URI.habitacion._, data });
			else
				await dataUpdate({
					path: URI.habitacion._,
					data,
					params: { codigo: habitacion?.codigo },
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
				path: URI.habitacion._,
				params: { codigo: habitacion?.codigo },
			});
		} catch (error) {
			sweetAlert({
				title: 'Error',
				text: 'No se pudo eliminar la habitación',
				icon: 'error',
				timer: 3000,
			});
		}
	};

	if (isFloorLoading || isHTypeLoading || isAreaLoading)
		return <GridSkeleton />;
	if (isFloorError || isHTypeError || isAreaError)
		return <ErrorLayout error='No se pudo cargar un parmámetro' />;

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
						Formulario habitación
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							name='nombre'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Número'
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
							name='precio'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label='Precio'
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												Q.
											</InputAdornment>
										),
									}}
									error={!!errors.precio}
									helperText={
										errors.precio
											? errors.precio?.message
											: ''
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
									sx={{}}
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
						<MiAutocomplete
							control={control as any}
							name='area'
							options={areas.rows.map((item: TiposType) => ({
								id: item.codigo,
								label: item.nombre,
							}))}
							placeholder='Área'
						/>
						<MiAutocomplete
							control={control as any}
							name='nivel'
							options={floors.rows.map((item: TiposType) => ({
								id: item.codigo,
								label: item.nombre,
							}))}
							placeholder='Nivel'
						/>
						<MiAutocomplete
							control={control as any}
							name='tipo'
							options={habTypes.rows.map((item: TiposType) => ({
								id: item.codigo,
								label: item.nombre,
							}))}
							placeholder='Tipo de habitación'
						/>
					</Box>
					<FormActions
						isNew={habitacion?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormHabitacion;
