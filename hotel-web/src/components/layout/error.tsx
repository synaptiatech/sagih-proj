import { Box, Container, Typography } from '@mui/material';
import { NotFoundImg } from '../../static';

const ErrorLayout = ({ error }: { error: string }) => {
	return (
		<Box id='__next' component='div'>
			<Box
				sx={{
					backgroundColor: '#FFF',
					height: '100%',
					width: '100%',
					paddingY: '80px',
				}}>
				<Container sx={{ marginX: 'auto', width: '100%' }}>
					<Typography variant='h1' textAlign='center'>
						400 - Error en obtener los datos
					</Typography>
					<Typography
						variant='h6'
						color='textSecondary'
						textAlign='center'>
						{error}
					</Typography>
					<Box
						display='flex'
						justifyContent='center'
						maxHeight='400px'>
						<img src={NotFoundImg} alt='Page not found' />
					</Box>
				</Container>
			</Box>
		</Box>
	);
};

export default ErrorLayout;
