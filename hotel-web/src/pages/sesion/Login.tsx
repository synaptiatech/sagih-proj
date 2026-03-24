import { yupResolver } from '@hookform/resolvers/yup';
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ContentWithTitle } from '../../components/card/Content';
import { BASE_URL, URI } from '../../consts/Uri';
import { useStore } from '../../hooks/useStore';
import { UsuarioType, schemaLogin } from '../../props/UsuarioProps';
import { dataPost } from '../../services/fetching.service';
import { handleError } from '../../utils/HandleError';

const Login = () => {
	const { setState } = useStore();
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<UsuarioType>({
		defaultValues: {
			usuario: '',
			password: '',
		},
		resolver: yupResolver(schemaLogin),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<UsuarioType> = async (data) => {
		try {
			const { data: result } = await dataPost({
				path: URI.usuario + '/login',
				data,
			});

			if (result === undefined) return;

			setState(result);
			navigate('/dashboard/inicio');
			location.reload();
		} catch (error) {
			handleError(
				'No se pudo iniciar sesión. Verifique sus datos.',
				error
			);
		}
	};

	const onRecovery = () => {
		navigate('/recovery', {
			replace: true,
		});
	};

	const handleGoogle = async () => {
		const popup = window.open(
			`${BASE_URL}/auth/google`,
			'targetWindow',
			`toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1,width=620,height=700`
		);
		window.addEventListener('message', (event) => {
			if (event.origin !== BASE_URL) return;
			if (event.data) {
				localStorage.setItem('user', JSON.stringify(event.data));
				popup?.close();
			}
		});
	};

	const onSuccess = async ({ profileObj }: any) => {
		let usuario: UsuarioType = {
			usuario: profileObj.name,
			correo: profileObj.email,
			googleId: profileObj.googleId,
			password: '',
			passwordConfirmation: '',
			perfil: 1,
		};
		try {
			const { data: result } = await dataPost({
				path: URI.usuario + '/google-login',
				data: usuario,
			});
			setState(result);
			console.log(result);
			navigate('/dashboard');
		} catch (error) {
			handleError(
				'No se pudo iniciar sesión. Verifique sus datos.',
				error
			);
		}
	};

	const onFailure = (error: any) => {
		console.log('Failure', error);
	};

	useEffect(() => {}, []);

	return (
		<ContentWithTitle title='Acceder a la aplicación'>
			<>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Card sx={{ width: 300, py: 2, m: 'auto' }}>
						<CardContent>
							<Typography
								variant='h5'
								component='div'
								color='text.secondary'
								gutterBottom>
								Inicio de sesión
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
										helperText={
											errors.usuario?.message || ''
										}
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
										helperText={
											errors.password?.message || ''
										}
									/>
								)}
							/>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
								}}>
								<Button variant='text' onClick={onRecovery}>
									Olvidé mi contraseña
								</Button>
							</Box>
							<Button variant='contained' fullWidth type='submit'>
								Iniciar sesión
							</Button>
						</CardContent>
						{/* <Box
							component='div'
							sx={{
								display: 'flex',
								flexDirection: 'column',
								placeContent: 'center',
								placeItems: 'center',
								gap: 2,
							}}>
							<Typography
								variant='h6'
								component='div'
								color='text.secondary'>
								o
							</Typography>
							<Button
								variant='outlined'
								onClick={handleGoogle}
								startIcon={<Google />}>
								Iniciar con Google
							</Button>
						</Box> */}
					</Card>
				</form>
			</>
		</ContentWithTitle>
	);
};

export default Login;
