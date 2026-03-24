import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Divider,
	Drawer,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { MouseEvent, useEffect, useState } from 'react';
import { DrawerProps } from '../../props/DrawerProps';
import { NavItem } from './NavItem';
import { MenuType } from '../../props/PermisoType';
import { useStore } from '../../hooks/useStore';
import { PermisoUser } from '../../props/StoreProps';

const useMenu = () => {
	const { isLogged, permisos } = useStore();
	const [menu, setMenu] = useState<MenuType>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isLogged() && permisos.length > 0) {
			setLoading(true);
			setMenu(
				permisos.reduce(
					(acc: any, cur: PermisoUser) => {
						if (!acc[cur.menu]) acc[cur.menu] = [];
						acc[cur.menu].push({
							Title: cur.nombre,
							Path: cur.forma,
						});
						return acc;
					},
					{ Inicio: [] }
				)
			);
			setLoading(false);
		}
	}, [permisos]);

	return { menu, loading };
};

export const Sidebar = ({ open, setOpen }: DrawerProps) => {
	const { menu, loading } = useMenu();
	const theme = useTheme();
	const lgUp = useMediaQuery(theme.breakpoints.up('lg'), {
		defaultMatches: true,
		noSsr: false,
	});

	const [expanded, setExpanded] = useState<string | false>(false);

	const handleDrawer = (_event: MouseEvent) => {
		setOpen(false);
	};

	const handleChange =
		(panel: string) =>
		(_event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded ? panel : false);
		};

	const Content = (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
				}}>
				<div>
					<Box sx={{ p: 3 }}>SAGIH</Box>
				</div>
				<Divider sx={{ borderColor: '#2D3748', my: 1 }} />
				<Box sx={{ flexGrow: 1 }}>
					{Object.entries(menu).map(([key, value], index) => {
						return value.length > 1 ? (
							<Accordion
								key={`${key}-${index}`}
								sx={{
									background: '#111827',
									color: '#ffffff',
								}}
								expanded={expanded === `panel${key}`}
								onChange={handleChange(`panel${key}`)}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`panel${key}a-content`}
									id={`panel${key}a-header`}>
									<Typography>{key}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									{value.map((item: any) => (
										<NavItem
											key={`${key}-${item.Path}`}
											href={item.Path}
											title={item.Title}
											onClick={handleDrawer}
										/>
									))}
								</AccordionDetails>
							</Accordion>
						) : (
							<NavItem
								key={`${index}`}
								href={value[0].Path}
								title={value[0].Title}
								onClick={handleDrawer}
							/>
						);
					})}
				</Box>
			</Box>
		</>
	);

	if (loading) return <div>Loading...</div>;

	if (lgUp) {
		return (
			<Drawer
				anchor='left'
				open={open}
				variant='permanent'
				PaperProps={{
					sx: {
						backgroundColor: '#111827',
						color: '#FFFFFF',
						width: 280,
					},
				}}>
				{Content}
			</Drawer>
		);
	}

	return (
		<Drawer
			anchor='left'
			onClose={() => setOpen(false)}
			open={open}
			variant='temporary'
			PaperProps={{
				sx: {
					backgroundColor: '#111827',
					color: '#FFFFFF',
					width: 280,
				},
			}}
			sx={{ zIndex: theme.zIndex.appBar + 100 }}>
			{Content}
		</Drawer>
	);
};
