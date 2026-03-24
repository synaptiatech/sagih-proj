import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { URI } from '../../../consts/Uri';
import { PerfilContext } from '../../../contexts/PerfilProvider';
import { TiposType, schemaTipos } from '../../../props/Tipos';
import { dataPost, dataUpdate } from '../../../services/fetching.service';
import { gridStyle } from '../../../theme/FormStyle';
import { handleError } from '../../../utils/HandleError';
import FormActions from '../../show/FormActions';

export type FormPerfilProps = {
	onClose: () => void;
};

const FormPerfil: React.FC<FormPerfilProps> = ({ onClose }) => {
	const { state, dispatch } = useContext(PerfilContext);
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TiposType>({
		defaultValues: {
			codigo: state.perfil?.codigo || 0,
			nombre: state.perfil?.nombre || '',
			descripcion: state.perfil?.descripcion || '',
		},
		mode: 'onBlur',
		resolver: yupResolver(schemaTipos),
	});

	const onSubmit: SubmitHandler<TiposType> = async (data: TiposType) => {
		try {
			if (data.codigo === 0) {
				console.log('Create perfil', data);
				await dataPost({
					path: `${URI.perfil}`,
					data: {
						nombre: data.nombre,
						descripcion: data.descripcion,
					},
				});
			} else {
				console.log('Update perfil', data);
				await dataUpdate({
					path: `${URI.perfil}`,
					data: {
						nombre: data.nombre,
						descripcion: data.descripcion,
					},
					params: { codigo: data.codigo },
				});
			}
			reset();
			onClose();
		} catch (error) {
			handleError('No se pudo guardar el registro', error);
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Card
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						p: 2,
					}}>
					<Typography variant='h6' component='h2'>
						Formulario de perfil
					</Typography>
					<Box sx={gridStyle}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
							}}>
							<Controller
								control={control}
								name='nombre'
								render={({ field }) => (
									<TextField
										{...field}
										label='Nombre'
										variant='standard'
										error={!!errors.nombre}
										helperText={
											errors?.nombre?.message || ''
										}
									/>
								)}
							/>
							<Controller
								control={control}
								name='descripcion'
								render={({ field }) => (
									<TextField
										{...field}
										label='Descripción'
										variant='standard'
										error={!!errors.descripcion}
										helperText={
											errors?.descripcion?.message || ''
										}
									/>
								)}
							/>
						</Box>
						{/* <Permisos /> */}
					</Box>
					<FormActions
						isNew={state.perfil.codigo !== undefined}
						onBack={onClose}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormPerfil;
