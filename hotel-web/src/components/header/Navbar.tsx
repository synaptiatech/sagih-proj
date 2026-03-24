import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import {
	AppBar,
	Avatar,
	Box,
	IconButton,
	styled,
	Toolbar,
	Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import { BASE_URL, URI } from '../../consts/Uri';
import { useFetchData } from '../../hooks/useFetch';
import { useStore } from '../../hooks/useStore';
import { DrawerProps } from '../../props/DrawerProps';
import ErrorLayout from '../layout/error';
import Loader from '../layout/loader';
import AccountPopover from './AccountPopover';

const NavbarRoot = styled(AppBar)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	boxShadow: theme.shadows[3],
}));

export const Navbar = ({ setOpen }: DrawerProps) => {
	const { data, isLogged, resetState } = useStore();
	const {
		data: empresa,
		isLoading: isLoadingEmpresa,
		isError: isErrorEmpresa,
	} = useFetchData({
		path: `${URI.empresa}`,
		table: 'empresa',
	});
	const settingsRef = useRef<HTMLDivElement | null>(null);
	const [openAccountPopover, setOpenAccountPopover] = useState(false);

	if (isErrorEmpresa)
		return (
			<ErrorLayout error='No se pudo obtener los datos de la empresa' />
		);

	if (isLoadingEmpresa) return <Loader />;

	return (
		<>
			<NavbarRoot
				sx={{
					left: { lg: 280 },
					width: { lg: 'calc(100% - 280px)' },
				}}>
				<Toolbar
					disableGutters
					sx={{
						minHeight: 64,
						left: 0,
						px: 2,
					}}>
					<IconButton
						onClick={() => setOpen(true)}
						sx={{
							display: {
								xs: 'inline-flex',
								lg: 'none',
							},
						}}>
						<MenuIcon fontSize='small' />
					</IconButton>
					<img
						src={`${BASE_URL}${empresa.logo}` || ''}
						alt='Company logo'
						style={{
							height: 48,
						}}
					/>
					<Typography variant='subtitle1' color='text.primary'>
						{empresa?.nombre || 'Nombre de la empresa'}
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Typography variant='body2' color='text.secondary'>
						{data?.usuario || 'Usuario desconectado'}
					</Typography>
					<Avatar
						onClick={() => setOpenAccountPopover(true)}
						ref={settingsRef}
						sx={{
							cursor: 'pointer',
							height: 40,
							width: 40,
							ml: 1,
						}}>
						<AccountCircle fontSize='small' />
					</Avatar>
				</Toolbar>
			</NavbarRoot>
			<AccountPopover
				anchorEl={settingsRef.current}
				open={openAccountPopover}
				setOpen={() => setOpenAccountPopover(false)}
			/>
		</>
	);

	// const handleDrawerOpen = (event: MouseEvent) => {
	// 	setOpen(true);
	// };

	// const handleMenu = (event: any) => {
	// 	// setAnchorEl(event.currentTarget);
	// };

	// const handleClose = (event: MouseEvent) => {
	// 	// setAnchorEl(null);
	// };

	// return (
	// 	<AppBar position='static' sx={{ width: '100%' }}>
	// 		<Toolbar>
	// 			<IconButton
	// 				size='large'
	// 				edge='start'
	// 				color='inherit'
	// 				aria-label='menu'
	// 				sx={{ mr: 2 }}
	// 				onClick={handleDrawerOpen}>
	// 				<MenuIcon />
	// 			</IconButton>
	// 			<Box
	// 				sx={{
	// 					flexGrow: 1,
	// 					display: 'flex',
	// 					flexDirection: 'column',
	// 				}}>
	// 				<Typography variant='h6' component='div'>
	// 					Hotel Management System
	// 				</Typography>
	// 				<Typography sx={{ fontSize: 14 }} component='div'>
	// 					Company name
	// 				</Typography>
	// 			</Box>
	// 			<div>
	// 				<IconButton
	// 					size='large'
	// 					aria-label='account of current user'
	// 					aria-controls='menu-appbar'
	// 					aria-haspopup='true'
	// 					color='inherit'
	// 					onClick={handleMenu}>
	// 					<AccountCircle />
	// 				</IconButton>
	// 				<Menu
	// 					id='menu-appbar'
	// 					anchorEl={anchorEl}
	// 					anchorOrigin={{
	// 						vertical: 'top',
	// 						horizontal: 'right',
	// 					}}
	// 					keepMounted
	// 					transformOrigin={{
	// 						vertical: 'top',
	// 						horizontal: 'right',
	// 					}}
	// 					open={Boolean(anchorEl)}
	// 					onClose={handleClose}>
	// 					<MenuItem onClick={handleClose}>Mi cuenta</MenuItem>
	// 					<MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
	// 				</Menu>
	// 			</div>
	// 		</Toolbar>
	// 	</AppBar>
	// );
};

// EVENTO DE CLIC PARA EDICIÓN
// BOTONES PARA EDICIÓN, ELIMINACIÓN
