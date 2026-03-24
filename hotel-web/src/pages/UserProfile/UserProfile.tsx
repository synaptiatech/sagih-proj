import React, { useMemo, useState } from 'react';
import { useFetchData } from '../../hooks/useFetch';
import { URI } from '../../consts/Uri';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
	userProfileDefault,
	UserProfileSchema,
	UserProfileType,
} from '../../models/UserProfile';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, TextField } from '@mui/material';
import { ContentWithTitle } from '../../components/card/Content';
import { gridStyle } from '../../theme/FormStyle';
import { dataUpdate } from '../../services/fetching.service';
import swal from 'sweetalert';

export type UserProfileProps = Record<string, never>;

const UserProfile: React.FC<UserProfileProps> = ({}) => {
	const [editMode, setEditMode] = useState(false);
	const {
		data: user,
		isLoading,
		isError,
		refetch,
	} = useFetchData({
		path: `${URI.usuario}`,
		query: {},
	});
	const { control, setValue, handleSubmit } = useForm<UserProfileType>({
		defaultValues: userProfileDefault,
		mode: 'onBlur',
		resolver: yupResolver(UserProfileSchema),
	});

	const onSubmit: SubmitHandler<UserProfileType> = async (data) => {
		const result = await dataUpdate({
			path: `${URI.usuario}`,
			data: data,
			params: { codigo: user.codigo },
		});
		if (result.request.status !== 200) {
			swal('¡Error!', 'No se ha podido actualizar el perfil', 'error');
		}
		swal('¡Listo!', 'Se ha actualizado el perfil', 'success');
		refetch();
		setEditMode(false);
	};

	useMemo(() => {
		if (user?.codigo) {
			setValue('correo', user.correo);
			setValue('usuario', user.usuario);
		}
	}, [user]);

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (isError) {
		return <div>Error</div>;
	}

	return (
		<ContentWithTitle title='Perfil de usuario'>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Card
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
							p: 4,
						}}>
						<Box sx={gridStyle}>
							<Controller
								control={control}
								name='usuario'
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...field}
										label='Usuario'
										variant='standard'
										InputProps={{
											readOnly: !editMode,
											disabled: !editMode,
										}}
										error={!!error}
										helperText={error?.message ?? null}
									/>
								)}
							/>
							<Controller
								control={control}
								name='correo'
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...field}
										type='email'
										label='Correo electrónico'
										variant='standard'
										InputProps={{
											readOnly: !editMode,
											disabled: !editMode,
										}}
										error={!!error}
										helperText={error?.message ?? null}
									/>
								)}
							/>
							<Controller
								control={control}
								name='password'
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...field}
										type='password'
										label='Contraseña'
										variant='standard'
										InputProps={{
											readOnly: !editMode,
											disabled: !editMode,
										}}
										error={!!error}
										helperText={error?.message ?? null}
									/>
								)}
							/>
							<Controller
								control={control}
								name='confirmPassword'
								render={({ field, fieldState: { error } }) => (
									<TextField
										{...field}
										type='password'
										label='Confirmar contraseña'
										variant='standard'
										InputProps={{
											readOnly: !editMode,
											disabled: !editMode,
										}}
										error={!!error}
										helperText={error?.message ?? null}
									/>
								)}
							/>
							<Button
								type='button'
								variant='contained'
								onClick={() => setEditMode(!editMode)}>
								{editMode ? 'Cancelar' : 'Editar perfil'}
							</Button>
							{editMode && (
								<Button type='submit' variant='outlined'>
									Guardar cambios
								</Button>
							)}
						</Box>
					</Card>
				</form>
			</Box>
		</ContentWithTitle>
	);
};

export default UserProfile;
