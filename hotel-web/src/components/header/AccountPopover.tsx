import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { AccountPopoverProps } from '../../props/DrawerProps';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';

const AccountPopover = ({
	anchorEl,
	setOpen,
	open,
	...other
}: AccountPopoverProps) => {
	const { data, isLogged, resetState } = useStore();
	const navigate = useNavigate();

	const handleProfile = () => {
		setOpen(false);
		navigate('perfil');
	};

	const handleLogout = () => {
		setOpen(false);
		resetState();
		navigate('/');
	};

	const handleLogin = () => {
		setOpen(false);
		navigate('/');
	};

	return (
		<Popover
			anchorEl={anchorEl}
			open={open}
			onClose={() => setOpen(false)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			PaperProps={{
				sx: {
					width: '300px',
				},
			}}
			{...other}>
			<Box sx={{ py: 1.5, px: 1 }}>
				<Typography variant='overline'>
					Usuario {data?.usuario || 'Desconocido'}
				</Typography>
			</Box>
			<MenuList
				disablePadding
				sx={{
					'& > *': {
						'&:first-of-type': {
							borderTopColor: 'divider',
							borderTopStyle: 'solid',
							borderTopWidth: 1,
						},
						padding: '12px 16px',
					},
				}}>
				{isLogged() ? (
					<>
						<MenuItem onClick={handleProfile}>Perfil</MenuItem>
						<MenuItem onClick={handleLogout}>
							Cerrar sesión
						</MenuItem>
					</>
				) : (
					<MenuItem onClick={handleLogin}>Iniciar sesión</MenuItem>
				)}
			</MenuList>
		</Popover>
	);
};

export default AccountPopover;
