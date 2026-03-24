import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, TextField } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { Content, ContentWithTitle } from '../../../components/card/Content';
import ErrorLayout from '../../../components/layout/error';
import Loader from '../../../components/layout/loader';
import GridSkeleton from '../../../components/layout/waiting';
import { URI } from '../../../consts/Uri';
import { useFetch } from '../../../hooks/useFetch';
import { CierreType, schemaCierre } from '../../../props/CierreProps';
import { dataPost, downloadFile } from '../../../services/fetching.service';
import { downloadFileByBloodPart } from '../../../utils/DownloadFile';
import { handleError } from '../../../utils/HandleError';

export type CierreProps = {};

const Cierre: React.FC<CierreProps> = () => {
	const [loading, setLoading] = useState(false);
	const [isClosed, setisClosed] = useState(false);
	const {
		data: cierre,
		refetch,
		isLoading,
		isError,
	} = useFetch({
		path: `${URI.cierre}/one`,
		table: 'cierre',
		columns: {
			fecha_cierre: 'Cierre',
		},
	});
	const {
		control,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<CierreType>({
		defaultValues: {
			openingDate: dayjs().format('YYYY-MM-DD HH:mm'),
			shiftClose: dayjs().format('YYYY-MM-DD HH:mm'),
			actualClose: dayjs().format('YYYY-MM-DD HH:mm'),
		},
		resolver: yupResolver(schemaCierre),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<CierreType> = async (data: CierreType) => {
		try {
			const body = {
				fecha_cierre: dayjs(
					data.shiftClose,
					'YYYY-MM-DD HH:mm:ss'
				).format('YYYY-MM-DD HH:mm:ss'),
				fecha_real: dayjs(
					data.actualClose,
					'YYYY-MM-DD HH:mm:ss'
				).format('YYYY-MM-DD HH:mm:ss'),
			};
			console.log({ body });

			await dataPost({
				path: `${URI.cierre}`,
				data: body,
			});
			refetch();
			swal(
				'¡Cierre realizado!',
				'El cierre se realizó correctamente',
				'success'
			);
			setisClosed(true);
		} catch (error) {
			handleError('No se pudo realizar el cierre', error);
		}
	};

	const download = async () => {
		try {
			setLoading(true);

			console.log({
				openingDate: getValues('openingDate'),
				shiftClose: getValues('shiftClose'),
				actualClose: getValues('actualClose'),
			});

			const { data } = await downloadFile({
				path: `${URI.reporte}/cierre`,
				name: 'Cierre',
				table: 'cierre',
				columns: {},
				where: {
					fecha_apertura: dayjs(
						getValues('openingDate'),
						'YYYY-MM-DDTHH:mm:ss'
					).format('YYYY-MM-DD HH:mm:ss'),
					fecha_cierre_turno: getValues('shiftClose'),
					fecha_cierre: getValues('actualClose'),
				},
			});
			downloadFileByBloodPart(data, 'Cierre');
		} catch (error) {
			handleError('No se pudo realizar el cierre', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cierre !== undefined) {
			console.log('Cierre >', cierre);
			setValue(
				'openingDate',
				dayjs(
					cierre?.fecha_cierre ?? new Date(),
					'YYYY-MM-DD HH:mm:ss:SSSZ'
				).format('YYYY-MM-DDTHH:mm:ss')
			);
		}
	}, [isLoading]);

	if (isLoading) return <GridSkeleton />;
	if (isError) return <ErrorLayout error='No se pudo cargar los datos' />;

	return (
		<>
			<ContentWithTitle title='Cierre de turno'>
				<Card>
					<Content>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									flexWrap: 'wrap',
									gap: 2,
									p: 2,
								}}>
								<Controller
									control={control}
									name='openingDate'
									render={({ field }) => (
										<TextField
											{...field}
											label='Apertura'
											variant='standard'
											type='datetime-local'
											InputLabelProps={{
												shrink: true,
											}}
											InputProps={{
												readOnly: true,
											}}
											error={!!errors.openingDate}
											helperText={
												errors.openingDate?.message
											}
										/>
									)}
								/>
								<Controller
									control={control}
									name='shiftClose'
									render={({ field }) => (
										<TextField
											{...field}
											label='Cierre de turno'
											variant='standard'
											type='datetime-local'
											InputLabelProps={{
												shrink: true,
											}}
											error={!!errors.shiftClose}
											helperText={
												errors.shiftClose?.message
											}
										/>
									)}
								/>
								<Controller
									control={control}
									name='actualClose'
									render={({ field }) => (
										<TextField
											{...field}
											label='Cierre real'
											variant='standard'
											type='datetime-local'
											InputLabelProps={{
												shrink: true,
											}}
											InputProps={{
												readOnly: true,
											}}
											error={!!errors.actualClose}
											helperText={
												errors.actualClose?.message
											}
										/>
									)}
								/>
								<Button
									type='submit'
									variant='contained'
									disabled={isClosed}>
									Cerrar turno
								</Button>
							</Box>
						</form>
						<Button variant='contained' onClick={() => download()}>
							Generar reporte
						</Button>
					</Content>
				</Card>
			</ContentWithTitle>
			{loading && <Loader />}
		</>
	);
};

export default Cierre;
