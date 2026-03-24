import { Box, Button, Container, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotFoundImg } from '../static';

const NotFound = () => {
	const navigate = useNavigate();

	const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		navigate(-1);
	};

	return (
		<Box id='__next' component='div'>
			<Box
				sx={{
					backgroundColor: '#FFF',
					height: '100vh',
					width: '100vw',
					paddingY: '80px',
				}}>
				<Container sx={{ marginX: 'auto', width: '100%' }}>
					<Typography variant='h1' textAlign='center'>
						404 - Página no encontrada
					</Typography>
					<Typography
						variant='h6'
						color='textSecondary'
						textAlign='center'>
						La página que estás buscando no existe o ha sido movida.
					</Typography>
					<Box
						display='flex'
						justifyContent='center'
						maxHeight='400px'>
						<img src={NotFoundImg} alt='Page not found' />
					</Box>
					<Box
						display='flex'
						justifyContent='center'
						marginTop='48px'>
						<Button
							variant='outlined'
							onClick={handleSubmit}
							type='button'>
							Regresar al dashboard
						</Button>
					</Box>
				</Container>
			</Box>
		</Box>
	);
};

export default NotFound;
