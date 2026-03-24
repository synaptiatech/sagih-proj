import { Box, CircularProgress } from '@mui/material';

const spinnerStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	display: 'flex',
	placeContent: 'center',
	placeItems: 'center',
	height: '100vh',
	width: '100vw',
	background: '#1e1e1e1e',
};

const Loader = () => {
	return (
		<>
			<Box sx={spinnerStyle}>
				<CircularProgress color='primary' />
			</Box>
		</>
	);
};

export default Loader;
