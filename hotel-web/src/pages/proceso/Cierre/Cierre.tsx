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

const INPUT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const API_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const toInputDateTime = (value?: string | Date | null) => {
	if (!value) {
		return dayjs().format(INPUT_DATE_TIME_FORMAT);
	}

	const parsed = dayjs(value);
	if (parsed.isValid()) {
		return parsed.format(INPUT_DATE_TIME_FORMAT);
	}

	return dayjs().format(INPUT_DATE_TIME_FORMAT);
};

const toApiDateTime = (value?: string | null) => {
	if (!value) {
		return dayjs().format(API_DATE_TIME_FORMAT);
	}

	const parsed = dayjs(value);
	if (parsed.isValid()) {
		return parsed.format(API_DATE_TIME_FORMAT);
	}

	return dayjs().format(API_DATE_TIME_FORMAT);
};

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
			openingDate: toInputDateTime(new Date()),
			shiftClose: toInputDateTime(new Date()),
			actualClose: toInputDateTime(new Date()),
		},
		resolver: yupResolver(schemaCierre),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<CierreType> = async (data: CierreType) => {
		try {
			const body = {
				fecha_cierre: toApiDateTime(data.shiftClose),
				fecha_real: toApiDateTime(data.actualClose),
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

			const openingDate = toApiDateTime(getValues('openingDate'));
			const shiftClose = toApiDateTime(getValues('shiftClose'));
			const actualClose = toApiDateTime(getValues('actualClose'));

			console.log({
				openingDate,
				shiftClose,
				actualClose,
			});

			const { data } = await downloadFile({
				path: `${URI.reporte}/cierre`,
				name: 'Cierre',
				table: 'cierre',
				columns: {},
				where: {
					fecha_apertura: openingDate,
					fecha_cierre_turno: shiftClose,
					fecha_cierre: actualClose,
				},
			});

			downloadFileByBloodPart(data, 'Cierre');
		} catch (error) {
			handleError('No se pudo generar el reporte de cierre', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cierre !== undefined) {
			console.log('Cierre >', cierre);

			setValue(
				'openingDate',
				toInputDateTime(cierre?.fecha_cierre ?? new Date())
			);
		}
	}, [cierre, setValue]);

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
								}}
							>
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
											helperText={errors.openingDate?.message}
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
											helperText={errors.shiftClose?.message}
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
											helperText={errors.actualClose?.message}
										/>
									)}
								/>
								<Button
									type='submit'
									variant='contained'
									disabled={isClosed}
								>
									Cerrar turno
								</Button>
							</Box>
						</form>

						<Button variant='contained' onClick={download}>
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
