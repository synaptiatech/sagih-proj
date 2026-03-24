import { yupResolver } from '@hookform/resolvers/yup';
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
} from '@mui/material';
import { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { URI } from '../../consts/Uri';
import { AuthContext } from '../../contexts/AuthProvider';
import { UsuarioType, schemaLogup } from '../../props/UsuarioProps';
import { dataPost } from '../../services/fetching.service';

const Registro = () => {
	const { state, dispatch } = useContext(AuthContext);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<UsuarioType>({
		defaultValues: {
			usuario: '',
			correo: '',
			password: '',
			passwordConfirmation: '',
		},
		resolver: yupResolver(schemaLogup),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<UsuarioType> = async (data) => {
		try {
			const { data: response } = await dataPost({
				path: URI.usuario + '/logup',
				data: {
					usuario: data.usuario,
					correo: data.correo,
				},
			});
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card sx={{ minWidth: 275 }}>
				<CardContent>
					<Typography
						variant='h5'
						component='div'
						color='text.secondary'
						gutterBottom>
						Crear cuenta
					</Typography>
					<Controller
						name='usuario'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								sx={{ my: '0.5rem' }}
								required
								label='Usuario'
								fullWidth
								error={!!errors.usuario}
								helperText={errors.usuario?.message || ''}
							/>
						)}
					/>
					<Controller
						name='correo'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								sx={{ my: '0.5rem' }}
								required
								label='Correo electrónico'
								fullWidth
								error={!!errors.correo}
								helperText={errors.correo?.message || ''}
							/>
						)}
					/>
					<Controller
						name='password'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								sx={{ my: '0.5rem' }}
								required
								label='Contraseña'
								fullWidth
								type='password'
								error={!!errors.password}
								helperText={errors.password?.message || ''}
							/>
						)}
					/>
					<Controller
						name='passwordConfirmation'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								sx={{ my: '0.5rem' }}
								required
								label='Confirmar contraseña'
								fullWidth
								type='password'
								error={!!errors.passwordConfirmation}
								helperText={
									errors.passwordConfirmation?.message || ''
								}
							/>
						)}
					/>
					<Button variant='contained' fullWidth type='submit'>
						Crear cuenta
					</Button>
				</CardContent>
				<Box
					component='div'
					sx={{
						p: 2,
						pt: 4,
						display: 'flex',
						justifyContent: 'space-between',
					}}>
					<Typography
						variant='h6'
						component='div'
						color='text.secondary'>
						¿Ya tienes cuenta?
					</Typography>
					<Button variant='text' type='button'>
						<Link to='/'>Iniciar sesión</Link>
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default Registro;
