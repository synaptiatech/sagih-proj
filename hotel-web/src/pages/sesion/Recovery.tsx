import {
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { dataGet } from '../../services/fetching.service';
import { handleError } from '../../utils/HandleError';
import { URI } from '../../consts/Uri';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const Recovery = () => {
	const [email, setEmail] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event: SyntheticEvent) => {
		event.preventDefault();
		try {
			await dataGet({
				path: `${URI.usuario}/recovery`,
				params: { email },
			});
			swal(
				'Correo enviado',
				'Se ha enviado un correo a su cuenta.',
				'success'
			);
		} catch (error) {
			handleError('No se pudo enviar el correo.', error);
		}
	};

	const onLogin = () => {
		navigate('/', {
			replace: true,
		});
	};

	return (
		<Card sx={{ minWidth: 275 }}>
			<CardContent>
				<Typography variant='h5' component='div'>
					Recuperar contraseña
				</Typography>
				<TextField
					sx={{ my: '0.5rem' }}
					required
					id='email'
					label='Correo electrónico'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					fullWidth
				/>
				<Button variant='contained' fullWidth onClick={handleSubmit}>
					Enviar
				</Button>
				<Button
					variant='text'
					sx={{ mt: 2, mx: 'auto' }}
					onClick={onLogin}>
					Iniciar sesión
				</Button>
			</CardContent>
		</Card>
	);
};

export default Recovery;
