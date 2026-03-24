import { Box, styled } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../components/drawer/Sidebar';
import { Navbar } from '../../components/header/Navbar';
import { ErrorBoundary } from '../ErrorBoundary';

const LayoutRoot = styled('div')(({ theme }) => ({
	display: 'flex',
	flex: '1 1 auto',
	placeSelf: 'stretch',
	maxWidth: '100%',
	paddingTop: 64,
	[theme.breakpoints.up('lg')]: {
		paddingLeft: 280,
	},
}));

const Admin = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<LayoutRoot>
				<Box
					sx={{
						display: 'flex',
						flex: '1 1 auto',
						flexDirection: 'column',
						width: '100%',
						padding: 2,
					}}>
					<ErrorBoundary>
						<Outlet />
					</ErrorBoundary>
				</Box>
			</LayoutRoot>
			<Navbar open={open} setOpen={setOpen} />
			<Sidebar open={open} setOpen={setOpen} />
		</>
	);
};

export default Admin;
