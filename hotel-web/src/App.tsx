import { Box, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import queryClient from './queryClient';
import { router } from './routes/Router';
import { theme } from './theme';

const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '';

function App() {
	return (
		<Box
			component='div'
			sx={{
				width: '100vw',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'row',
				placeContent: 'center',
				placeItems: 'center',
			}}
			className='bg-slate-300'>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>
						<RouterProvider router={router} />
					</ThemeProvider>
				</QueryClientProvider>
			</AuthProvider>
		</Box>
	);
}

export default App;
