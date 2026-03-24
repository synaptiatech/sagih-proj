import { Box, Button, Card, TextField } from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Content, ContentWithTitle } from '../../../components/card/Content';
import { URI } from '../../../consts/Uri';
import { CierreType } from '../../../props/CierreProps';
import { downloadFile } from '../../../services/fetching.service';
import { downloadFileByBloodPart } from '../../../utils/DownloadFile';
import { formatToDateTime } from '../../../utils/Formateo';
import { handleError } from '../../../utils/HandleError';

export type HistoriaCierreProps = Record<string, unknown>;

const HistoriaCierre: React.FC<HistoriaCierreProps> = ({}) => {
	const { control, handleSubmit } = useForm<CierreType>({
		defaultValues: {
			openingDate: formatToDateTime(new Date()),
			shiftClose: formatToDateTime(new Date()),
			actualClose: formatToDateTime(new Date()),
		},
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<CierreType> = async (dates) => {
		try {
			const { data } = await downloadFile({
				path: `${URI.reporte}/cierre`,
				name: 'Cierre',
				table: 'cierre',
				columns: {},
				where: {
					fecha_apertura: dates.openingDate.replace('T', ' '),
					fecha_cierre_turno: dates.shiftClose.replace('T', ' '),
					fecha_cierre: dates.actualClose.replace('T', ' '),
				},
			});
			downloadFileByBloodPart(data, 'Reporte de cierre');
		} catch (error) {
			handleError('No se pudo realizar el cierre', error);
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
								}}>
								<Controller
									control={control}
									name='openingDate'
									render={({ field }) => (
										<TextField
											{...field}
											label='Inicio'
											variant='standard'
											type='datetime-local'
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
