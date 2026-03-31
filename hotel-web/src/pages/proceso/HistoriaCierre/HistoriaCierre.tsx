import { Box, Button, Card, TextField } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Content, ContentWithTitle } from '../../../components/card/Content';
import { URI } from '../../../consts/Uri';
import { CierreType } from '../../../props/CierreProps';
import { downloadFile } from '../../../services/fetching.service';
import { downloadFileByBloodPart } from '../../../utils/DownloadFile';
import { handleError } from '../../../utils/HandleError';

export type HistoriaCierreProps = Record<string, unknown>;

const INPUT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const API_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const toInputDateTime = (value?: string | Date | null) => {
	if (!value) return dayjs().format(INPUT_DATE_TIME_FORMAT);

	const parsed = dayjs(value);
	return parsed.isValid()
		? parsed.format(INPUT_DATE_TIME_FORMAT)
		: dayjs().format(INPUT_DATE_TIME_FORMAT);
};

const toApiDateTime = (value?: string | null) => {
	if (!value) return dayjs().format(API_DATE_TIME_FORMAT);

	const parsed = dayjs(value);
	return parsed.isValid()
		? parsed.format(API_DATE_TIME_FORMAT)
		: dayjs().format(API_DATE_TIME_FORMAT);
};

const HistoriaCierre: React.FC<HistoriaCierreProps> = () => {
	const { control, handleSubmit } = useForm<CierreType>({
		defaultValues: {
			openingDate: toInputDateTime(new Date()),
			shiftClose: toInputDateTime(new Date()),
			actualClose: toInputDateTime(new Date()),
		},
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<CierreType> = async (dates) => {
		try {
			const openingDate = toApiDateTime(dates.openingDate);
			const shiftClose = toApiDateTime(dates.shiftClose);
			const actualClose = toApiDateTime(dates.actualClose);

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

			downloadFileByBloodPart(data, 'Reporte de cierre');
		} catch (error) {
			handleError('No se pudo generar el reporte de cierre', error);
		}
	};

	return (
		<>
			<ContentWithTitle title='Historial de cierres de turno'>
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
											label='Inicio'
											variant='standard'
											type='datetime-local'
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>

								<Controller
									control={control}
									name='shiftClose'
									render={({ field }) => (
										<TextField
											{...field}
											label='Final'
											variant='standard'
											type='datetime-local'
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>

								<Controller
									control={control}
									name='actualClose'
									render={({ field }) => (
										<TextField
											{...field}
											label='Consultado'
											variant='standard'
											type='datetime-local'
											InputLabelProps={{ shrink: true }}
											InputProps={{
												readOnly: true,
											}}
										/>
									)}
								/>

								<Button variant='contained' type='submit'>
									Generar reporte
								</Button>
							</Box>
						</form>
					</Content>
				</Card>
			</ContentWithTitle>
		</>
	);
};

export default HistoriaCierre;
