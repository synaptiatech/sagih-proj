import { Lock, LockOpen } from '@mui/icons-material';
import { Box, Button, Card, Checkbox, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { URI } from '../../../consts/Uri';
import { PerfilContext } from '../../../contexts/PerfilProvider';
import { perfilTypes } from '../../../hooks/PerfilReducer';
import { useFetch } from '../../../hooks/useFetch';
import { RolPermissions } from '../../../models/RolPermissions';
import { dataUpdate } from '../../../services/fetching.service';

export type PermisosProps = {
	onClose: () => void;
};

const Permisos: React.FC<PermisosProps> = ({ onClose }) => {
	const { state, dispatch } = useContext(PerfilContext);
	const { data, isLoading, isError, refetch } = useFetch({
		table: 'permiso',
		path: `${URI.permiso}/all`,
		query: { perfil: +state.perfil.codigo },
	});

	const groupByPags = () => {
		const permsGrouppes = state.permisos.reduce((acc: any, curr: any) => {
			const { pag_nombre } = curr;
			if (!acc[pag_nombre]) {
				acc[pag_nombre] = [];
			}
			acc[pag_nombre].push(curr);
			return acc;
		}, {} as Record<string, RolPermissions[]>);
		console.log(Object.values(permsGrouppes));
		return Object.values(permsGrouppes);
	};

	const onChange = async (item: RolPermissions, value: boolean) => {
		await dataUpdate({
			path: `${URI.permiso}`,
			data: { estado: +value },
			params: {
				pagina: item.pagina,
				funcion: item.funcion,
				perfil: state.perfil.codigo,
			},
		});
		refetch();
	};

	useEffect(() => {
		if (data) {
			dispatch({
				type: perfilTypes.SET_PERMISOS,
				payload: data,
			});
		}
	}, [data]);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error...</div>;

	return (
		<>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					p: 2,
				}}>
				<Typography variant='h6' component={'h2'}>
					Gestor de permisos para el perfil {state.perfil.nombre}
				</Typography>
				{groupByPags().map((item: any) => (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							gap: 1,
							mt: 2,
						}}>
						<Typography variant='body1'>
							{item[0].pag_nombre}
						</Typography>
						<Box sx={{ flex: 1 }} />
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								flexWrap: 'wrap',
								gap: 2,
								ml: 2,
							}}>
							{item.map((permiso: RolPermissions) => (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
									}}>
									<Typography variant='body2'>
										{permiso.func_nombre}
									</Typography>
									<Checkbox
										icon={<Lock />}
										checkedIcon={<LockOpen />}
										checked={permiso.estado}
										onChange={(e) =>
											onChange(permiso, e.target.checked)
										}
										color='primary'
										title={permiso.func_nombre}
									/>
								</Box>
							))}
						</Box>
					</Box>
				))}
				<Button
					variant='contained'
					sx={{ alignSelf: 'flex-end' }}
					onClick={onClose}>
					Finalizar
				</Button>
			</Card>
		</>
	);
};

export default Permisos;
