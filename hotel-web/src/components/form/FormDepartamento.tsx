import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import {
	DepartamentoProps,
	DepartamentoType,
	schemaDepartamento,
} from '../../props/DepartamentoProps';
import { PaisType } from '../../props/PaisProps';
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

const FormDepartamento = ({
	departamento,
	onClose,
	...props
}: DepartamentoProps) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<DepartamentoType>({
		defaultValues: {
			codigo: departamento?.codigo || 0,
			nombre: departamento?.nombre || '',
			descripcion: departamento?.descripcion || '',
			pais: departamento?.pais || 0,
		},
		resolver: yupResolver(schemaDepartamento),
		mode: 'onBlur',
	});
	const {
		data: countries,
		isLoading,
		isError,
	} = useFetch({
		path: `${URI.pais}/all`,
		table: 'pais',
	});

	const onSubmit: SubmitHandler<DepartamentoType> = async (data) => {
		try {
			if (departamento?.codigo === undefined)
				await dataPost({ path: URI.departamento, data });
			else
				await dataUpdate({
					path: URI.departamento,
					data,
					params: { codigo: departamento?.codigo },
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
				path: URI.departamento,
				params: { codigo: departamento?.codigo || 0 },
			});
		} catch (error) {
			sweetAlert({
				title: 'Error',
				text: 'No se pudo eliminar el registro',
				icon: 'error',
				timer: 3000,
			});
		}
	};

	const onPrint = () => {
		sweetAlert({
			title: 'Imprimir',
			text: 'No se ha implementado la impresión',
			icon: 'warning',
			timer: 3000,
		});
	};

	if (isLoading) return <GridSkeleton />;
	if (isError) return <ErrorLayout error='No se pudo cargar un parámetro' />;

	return (
		<Box>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						padding: 2,
					}}>
					<Typography variant='h6' component='h2'>
						Formulario departamento
					</Typography>
					<Box sx={gridStyle}>
						<Controller
							name='nombre'
							control={control}
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
						<MiAutocomplete
							control={control as any}
							name='pais'
							options={countries.rows.map((item: PaisType) => ({
								id: item.codigo,
								label: item.nombre,
							}))}
							placeholder='País'
						/>
					</Box>
					<FormActions
						isNew={departamento?.codigo !== undefined}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</Box>
	);
};

export default FormDepartamento;
