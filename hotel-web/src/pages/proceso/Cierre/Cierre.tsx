import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, TextField } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export type CierreProps = {};

const TZ = 'America/Guatemala';
const INPUT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const API_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const nowInGuatemala = () => dayjs().tz(TZ);

const parseGuatemalaDate = (value?: string | Date | null) => {
	if (!value) return nowInGuatemala();

	if (value instanceof Date) {
		return dayjs(value).tz(TZ);
	}

	if (typeof value === 'string') {
		if (value.includes('T')) {
			const parsedInput = dayjs.tz(value, INPUT_DATE_TIME_FORMAT, TZ);
			if (parsedInput.isValid()) return parsedInput;
		}

		if (value.includes(' ')) {
			const parsedApi = dayjs.tz(value, API_DATE_TIME_FORMAT, TZ);
			if (parsedApi.isValid()) return parsedApi;
		}

		const parsedGeneral = dayjs(value);
		if (parsedGeneral.isValid()) return parsedGeneral.tz(TZ);
	}

	return nowInGuatemala();
};

const toInputDateTime = (value?: string | Date | null) => {
	return parseGuatemalaDate(value).format(INPUT_DATE_TIME_FORMAT);
};

const toApiDateTime = (value?: string | null) => {
	return parseGuatemalaDate(value).format(API_DATE_TIME_FORMAT);
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
			fecha_real: 'Cierre real',
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
			openingDate: toInputDateTime(nowInGuatemala().toDate()),
			shiftClose: toInputDateTime(nowInGuatemala().toDate()),
			actualClose: toInputDateTime(nowInGuatemala().toDate()),
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
		const now = nowInGuatemala();

		setValue('shiftClose', toInputDateTime(now.toDate()));
		setValue('actualClose', toInputDateTime(now.toDate()));

		if (cierre !== undefined) {
			console.log('Cierre >', cierre);

			const openingSource =
				cierre?.fecha_real ?? cierre?.fecha_cierre ?? now.toDate();

			setValue('openingDate', toInputDateTime(openingSource));
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
