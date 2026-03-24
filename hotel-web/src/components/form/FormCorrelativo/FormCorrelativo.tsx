import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { URI } from '../../../consts/Uri';
import { useFetch } from '../../../hooks/useFetch';
import {
	CorrelativoType,
	correlativoDefault,
	schemaCorrelativo,
} from '../../../models/Correlativo';
import { TiposType } from '../../../props/Tipos';
import { dataPost, dataUpdate } from '../../../services/fetching.service';
import { gridStyle } from '../../../theme/FormStyle';
import { handleError } from '../../../utils/HandleError';
import { MiAutocomplete } from '../../Autocomplete';
import ErrorLayout from '../../layout/error';
import GridSkeleton from '../../layout/waiting';
import FormActions from '../../show/FormActions';

export type FormCorrelativoProps = {
	correlativo: CorrelativoType;
	onClose: () => void;
};

const FormCorrelativo: React.FC<FormCorrelativoProps> = ({
	correlativo,
	onClose,
}) => {
	const {
		control,
		setValue,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<CorrelativoType>({
		defaultValues: {
			serie: correlativo.serie || correlativoDefault.serie,
			siguiente: correlativo.siguiente || correlativoDefault.siguiente,
			tipo_transaccion: correlativo.tipo_transaccion || '',
			tt_nombre: correlativo.tt_nombre || '',
		},
		resolver: yupResolver(schemaCorrelativo),
		mode: 'onBlur',
	});

	const {
		data: tipos,
		isLoading,
		isError,
	} = useFetch({
		path: `${URI.correlativo}/all`,
		table: 'tipo_transaccion',
	});

	console.log('Tipos', tipos);

	const onSubmit: SubmitHandler<CorrelativoType> = async (data) => {
		try {
			if (correlativo.serie !== undefined) {
				await dataUpdate({
					path: URI.correlativo,
					data: {
						siguiente: data.siguiente,
					},
					params: {
						serie: data.serie,
						tipo_transaccion: data.tipo_transaccion,
					},
				});
			} else {
				await dataPost({
					path: URI.correlativo,
					data: {
						siguiente: data.siguiente,
						serie: data.serie,
						tipo_transaccion: data.tipo_transaccion,
					},
				});
			}
			swal(
				'¡Registro guardado!',
				'El registro se guardó correctamente',
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar el registro', error);
		}
	};

	const onDelete = () => {};

	const onPrint = () => {};

	if (isLoading) return <GridSkeleton />;
	if (isError) return <ErrorLayout error='No se pudo cargar un parámetro' />;

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
					<Typography variant='h6' component={'h2'}>
						Formulario de correlativo
					</Typography>
					<Box sx={gridStyle}>
						{correlativo.serie !== undefined ? (
							<TextField
								label='Tipo de transacción'
								value={
									tipos.rows.find(
										(item: TiposType) =>
											`${item.codigo}` ===
											correlativo.tipo_transaccion
									)?.nombre
								}
								variant='outlined'
								InputProps={{
									readOnly: true,
								}}
							/>
						) : (
							<MiAutocomplete
								control={control as any}
								name='tipo_transaccion'
								options={tipos.rows.map((item: TiposType) => ({
									id: item.codigo,
									label: item.nombre,
								}))}
								placeholder='Tipo de transacción'
							/>
						)}
						<Controller
							control={control}
							name='serie'
							render={({ field }) => (
								<TextField
									{...field}
									label='Serie'
									error={!!errors.serie}
									helperText={errors.serie?.message || ''}
									InputProps={{
										readOnly:
											correlativo.serie !== undefined,
									}}
								/>
							)}
						/>
						<Controller
							control={control}
							name='siguiente'
							render={({ field }) => (
								<TextField
									{...field}
									label='No. documento'
									error={!!errors.siguiente}
									helperText={errors.siguiente?.message || ''}
								/>
							)}
						/>
					</Box>
					<FormActions
						isNew={true}
						onBack={onClose}
						onDelete={onDelete}
					/>
				</Card>
			</form>
		</>
	);
};

export default FormCorrelativo;
