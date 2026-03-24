import { Box, Button, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { DrawerItemProps } from '../../props/DrawerProps';

export const NavItem = ({
	href,
	title,
	onClick,
	...others
}: DrawerItemProps) => {
	const active: boolean = false;
	return (
		<ListItem
			disableGutters
			sx={{
				display: 'flex',
				mb: 0.5,
				py: 0,
				px: 2,
			}}
			{...others}>
			<Button
				component={Link}
				to={href}
				disableRipple
				onClick={onClick}
				sx={{
					backgroundColor: active ? 'rgba(255,255,255,0.08)' : '',
					borderRadius: 1,
					color: active ? 'secondary.main' : '#D1D5DB',
					fontWeight: active ? 'fontWeightBold' : '',
					justifyContent: 'flex-start',
					px: 3,
					my: 1,
					textAlign: 'left',
					textTransform: 'none',
					width: '100%',
					'& .MuiButton-startIcon': {
						color: active ? 'secondary.main' : '#9CA3AF',
					},
					'&:hover': {
						backgroundColor: 'rgba(255,255,255,0.08)',
					},
				}}>
				<Box sx={{ flexGrow: 1 }}>{title}</Box>
			</Button>
		</ListItem>
	);
};
