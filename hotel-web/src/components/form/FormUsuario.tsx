import { yupResolver } from '@hookform/resolvers/yup';
import {
	Autocomplete,
	Box,
	Card,
	Checkbox,
	FormLabel,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { URI } from '../../consts/Uri';
import { useFetch } from '../../hooks/useFetch';
import { TiposType } from '../../props/Tipos';
import {
	UsuarioProps,
	UsuarioType,
	schemaCreate,
} from '../../props/UsuarioProps';
import {
	dataDelete,
	dataPost,
	dataUpdate,
} from '../../services/fetching.service';
import { handleError } from '../../utils/HandleError';
import ErrorLayout from '../layout/error';
import Loader from '../layout/loader';
import GridSkeleton from '../layout/waiting';
import FormActions from '../show/FormActions';

const FormUsuario = ({ usuario, onClose, ...props }: UsuarioProps) => {
	const [waiting, setWaiting] = useState(false);
	const [genPassword, setGenPassword] = useState(false);
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UsuarioType>({
		defaultValues: {
			codigo: usuario?.codigo || 0,
			usuario: usuario?.usuario || '',
			correo: usuario?.correo || '',
			perfil: usuario?.perfil || 0,
			password: '',
		},
		mode: 'onBlur',
		resolver: yupResolver(schemaCreate),
	});
	const { data, isError, isLoading } = useFetch({
		path: `${URI.perfil}/all`,
		table: 'perfil',
	});

	const onSubmit: SubmitHandler<UsuarioType> = async (data) => {
		try {
			setWaiting(true);
			if (usuario?.codigo === undefined)
				await dataPost({
					path: URI.usuario,
					data: {
						perfil: data.perfil,
						usuario: data.usuario,
						correo: data.correo,
						pass: data.password,
					},
				});
			else
				await dataUpdate({
					path: URI.usuario,
					data: {
						perfil: data.perfil,
						usuario: data.usuario,
						correo: data.correo,
					},
					params: { codigo: usuario?.codigo },
				});
			swal(
				'Guardado',
				'Se ha guardado el registro satisfactoriamente',
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		} finally {
			setWaiting(false);
		}
	};

	const onDelete = async () => {
		try {
			await dataDelete({
				path: URI.usuario,
				params: { codigo: usuario?.codigo || 0 },
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

	const onPrint = () => {};

	if (isLoading) return <GridSkeleton />;

	if (isError)
		return <ErrorLayout error={'No se pudo cargar los perfiles'} />;

	return (
		<>
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
							Formulario de usuario
						</Typography>
						<Controller
							name='usuario'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type='text'
									label='Usuario'
									variant='standard'
									error={!!errors.usuario}
									helperText={
										errors.usuario
											? errors.usuario.message
											: ''
									}
								/>
							)}
						/>
						<Controller
							name='correo'
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									type='email'
									label='Correo electrónico'
									variant='standard'
									error={!!errors.correo}
									helperText={
										errors.correo
											? errors.correo.message
											: ''
									}
								/>
							)}
						/>
						{usuario?.codigo === undefined && (
							<Box
								sx={{
									display: 'flex',
									placeContent: 'left',
									placeItems: 'center',
								}}>
								<FormLabel>Autogenerar contraseña</FormLabel>
								<Checkbox
									sx={{ width: 'fit-content' }}
									checked={genPassword}
									title='Autogenerar contraseña'
									onChange={() =>
										setGenPassword(!genPassword)
									}
									inputProps={{ 'aria-label': 'controlled' }}
								/>
							</Box>
						)}
						{usuario?.codigo === undefined && (
							<Controller
								name='password'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										type='password'
										label='Contraseña'
										variant='standard'
										error={!!errors.password}
										helperText={
											errors.password
												? errors.password.message
												: ''
										}
									/>
								)}
							/>
						)}
						<Controller
							control={control}
							name='perfil'
							render={({ field }) => (
								<Autocomplete
									{...field}
									options={data || []}
									getOptionLabel={(perfil: TiposType) =>
										perfil.nombre ??
										data.find(
											(p: TiposType) =>
												p.codigo === perfil.codigo
										)?.nombre ??
										''
									}
									value={data.find(
										(p: TiposType) =>
											p.codigo === field.value
									)}
									onChange={(_, data) => {
										field.onChange(data?.codigo);
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Perfil'
											variant='standard'
											error={!!errors.perfil}
											helperText={
												errors.perfil
													? errors.perfil.message
													: ''
											}
										/>
									)}
								/>
							)}
						/>
						<FormActions
							isNew={true}
							onBack={onClose}
							onDelete={onDelete}
							onPrint={onPrint}
						/>
					</Card>
				</form>
			</Box>
			{waiting && <Loader />}
		</>
	);
};

export default FormUsuario;
