import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { FileUpload } from '../../components/FileUpload';
import { ContentWithTitle } from '../../components/card/Content';
import ErrorLayout from '../../components/layout/error';
import GridSkeleton from '../../components/layout/waiting';
import { BASE_URL, URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import { EmpresaType, schemaEmpresa } from '../../props/EmpresaProps';
import { dataPost } from '../../services/fetching.service';
import { gridStyle } from '../../theme/FormStyle';
import { handleError } from '../../utils/HandleError';

const Compania = () => {
	const [editing, setEditing] = useState(false);
	const {
		control,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<EmpresaType>({
		defaultValues: {
			codigo: 0,
			nombre: '',
			direccion: '',
			telefono: '',
			nit: '',
			correo: '',
			logo: '',
		},
		resolver: yupResolver(schemaEmpresa),
		mode: 'onBlur',
	});
	const { data, isLoading, error, refetch } = useFetch({
		path: `${URI.empresa}/get`,
		table: 'empresa',
	});

	const onSubmit: SubmitHandler<EmpresaType> = async (data) => {
		try {
			await dataPost({ path: URI.empresa, data });
			setEditing(false);
			swal(
				'Registro guardado',
				'Se guardo correctamente el registro',
				'success'
			);
		} catch (error) {
			handleError('Error al guardar el registro', error);
		} finally {
			refetch();
		}
	};

	const handleUpload = async (file: File) => {
		try {
			if (!file) return;
			const formData = new FormData();
			formData.append('image', file);
			const { data } = await dataPost({
				path: `${URI.empresa}/upload`,
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setValue('logo', `/${data.name}`);
			swal(
				'Imagen subida',
				'Se subio correctamente la imagen. Puede guardar los cambios',
				'success'
			);
		} catch (error) {
			handleError('Error al subir imagen', error);
		} finally {
			refetch();
		}
	};

	const handleEditar = () => {
		setEditing(true);
	};

	const handleCancelar = () => {
		setEditing(false);
	};

	useEffect(() => {
		if (data) {
			setValue('codigo', data.codigo);
			setValue('nombre', data.nombre);
			setValue('direccion', data.direccion);
			setValue('telefono', data.telefono);
			setValue('nit', data.nit);
			setValue('correo', data.correo);
			setValue('logo', data.logo);
		}
	}, [data]);

	if (isLoading) return <GridSkeleton />;
	if (error) return <ErrorLayout error={`${error}`} />;

	return (
		<ContentWithTitle title='Datos de la empresa'>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Card
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
							p: 4,
						}}>
						<Box sx={gridStyle}>
							<Controller
								name='nombre'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ m: 1, width: '100%' }}
										label='Nombre'
										variant='outlined'
										disabled={!editing}
										error={!!errors.nombre}
										helperText={errors.nombre?.message}
									/>
								)}
							/>
							<Controller
								name='direccion'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ m: 1, width: '100%' }}
										label='Dirección'
										variant='outlined'
										disabled={!editing}
										error={!!errors.direccion}
										helperText={errors.direccion?.message}
									/>
								)}
							/>
							<Controller
								name='telefono'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ m: 1, width: '100%' }}
										label='Telefono'
										variant='outlined'
										disabled={!editing}
										error={!!errors.telefono}
										helperText={errors.telefono?.message}
									/>
								)}
							/>
							<Controller
								name='nit'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ m: 1, width: '100%' }}
										label='Nit'
										variant='outlined'
										disabled={!editing}
										error={!!errors.nit}
										helperText={errors.nit?.message}
									/>
								)}
							/>
							<Controller
								name='correo'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ m: 1, width: '100%' }}
										label='Correo electrónico de la empresa'
										variant='outlined'
										disabled={!editing}
										error={!!errors.correo}
										helperText={errors.correo?.message}
									/>
								)}
							/>
						</Box>
						<Box sx={{ display: 'flex', gap: 2 }}>
							{editing ? (
								<>
									<Button
										variant='outlined'
										color='primary'
										onClick={handleCancelar}
										type='reset'>
										Cancelar
									</Button>
									<Button
										variant='contained'
										color='primary'
										type='submit'>
										Guardar
									</Button>
								</>
							) : (
								<Button
									variant='contained'
									color='primary'
									onClick={handleEditar}
									type='button'>
									Editar
								</Button>
							)}
						</Box>
					</Card>
				</form>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						gap: 2,
						justifyContent: 'space-around',
						alignItems: 'center',
						flexWrap: 'wrap',
					}}>
					{editing && (
						<FileUpload
							title='Logo de la empresa'
							onUpload={handleUpload}
						/>
					)}
					{getValues('logo') !== '' && (
						<img
							src={`${BASE_URL}/${getValues('logo')}`}
							alt='company logo'
							style={{ width: 250, height: 250 }}
						/>
					)}
				</Box>
			</Box>
		</ContentWithTitle>
	);
};

export default Compania;
