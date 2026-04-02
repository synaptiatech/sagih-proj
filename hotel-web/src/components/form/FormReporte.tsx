import {
	Box,
	Button,
	Card,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material';
import { FormEvent } from 'react';
import { reporteReducerTypes, reporteState } from '../../hooks/reporteReducer';
import FilasBox from '../../utils/FilasFlex';
import { Content, ContentWithTitle } from '../card/Content';
import { inputFormatValue } from '../../utils/Formateo';

const formatDateTimeLocalInput = (value: string | null | undefined): string => {
	if (!value) return '';

	const raw = String(value).trim();
	if (!raw) return '';

	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(raw)) {
		return raw;
	}

	if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(raw)) {
		return raw.replace(' ', 'T');
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
		return `${raw}T00:00:00`;
	}

	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) {
		return `${raw}:00`;
	}

	if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(raw)) {
		return raw.replace(' ', 'T') + ':00';
	}

	return raw;
};

const isDateTimeField = (query: any) => {
	const columna = String(query?.columna || '').toLowerCase();
	const nombre = String(query?.nombre || '').toLowerCase();

	return (
		columna.includes('fecha') ||
		columna.includes('date') ||
		columna.includes('timestamp') ||
		nombre.includes('fecha') ||
		nombre.includes('hora')
	);
};

const FormReporte = ({
	state,
	dispatch,
	handleSubmit,
}: {
	state: reporteState;
	dispatch: React.Dispatch<any>;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => {
	return (
		<>
			<ContentWithTitle title={state.title || 'Reporte parametrizado'}>
				<Card sx={{ mb: 4 }}>
					<Content>
						<>
							<FilasBox>
								<Typography variant='h5'>
									Criterio del reporte
								</Typography>
							</FilasBox>

							<form onSubmit={handleSubmit}>
								<Box
									sx={{
										display: 'grid',
										gap: 2,
										gridTemplateColumns: {
											xs: 'repeat(1, minmax(0, 1fr))',
											sm: 'repeat(2, minmax(0, 1fr))',
											md: 'repeat(3, minmax(0, 1fr))',
										},
										mb: 2,
										width: '100%',
									}}
								>
									{state.queryFiltro.map((query, index) => {
										const isDateTime = isDateTimeField(query);

										return (
											<Box
												key={`${query.columna}-${index}`}
												sx={{
													display: 'grid',
													gap: 2,
													gridTemplateColumns: isDateTime
														? {
																xs: 'minmax(0, 1fr)',
																sm: '110px 40px minmax(0, 1fr)',
														  }
														: {
																xs: 'minmax(0, 1fr)',
																sm: '110px 40px minmax(0, 1fr)',
														  },
													alignItems: 'center',
													minWidth: 0,
													width: '100%',
												}}
											>
												<Typography sx={{ py: 1 }}>
													{query.nombre}
												</Typography>

												<Typography sx={{ py: 1 }}>
													{query.relacion}
												</Typography>

												{query.valores.length ? (
													<TextField
														select
														sx={{ py: 1, width: '100%', minWidth: 0 }}
														label={query.nombre}
														variant='standard'
														color='primary'
														value={query.valor ?? ''}
														onChange={(e) => {
															dispatch({
																type: reporteReducerTypes.UPDATE_QUERY_VALOR,
																payload: {
																	index,
																	valor: e.target.value,
																},
															});
														}}
													>
														<MenuItem value=''>
															Todos
														</MenuItem>
														{query.valores.map((option: any, optionIndex: number) => (
															<MenuItem
																key={`${query.columna}-option-${option.id}-${optionIndex}`}
																value={option.id}
															>
																{option.valor}
															</MenuItem>
														))}
													</TextField>
												) : query.nombre
														.toLowerCase()
														.includes('mes') ? (
													<TextField
														sx={{ py: 1, width: '100%', minWidth: 0 }}
														type='month'
														variant='standard'
														color='primary'
														value={inputFormatValue(
															'month',
															query.valor
														)}
														onChange={(e) => {
															dispatch({
																type: reporteReducerTypes.UPDATE_QUERY_VALOR,
																payload: {
																	index,
																	valor: e.target.value,
																},
															});
														}}
													/>
												) : isDateTime ? (
													<TextField
														sx={{
															py: 1,
															width: '100%',
															minWidth: 0,
														}}
														type='datetime-local'
														variant='standard'
														color='primary'
														value={formatDateTimeLocalInput(query.valor)}
														onChange={(e) => {
															dispatch({
																type: reporteReducerTypes.UPDATE_QUERY_VALOR,
																payload: {
																	index,
																	valor: e.target.value,
																},
															});
														}}
														inputProps={{
															step: 1,
														}}
													/>
												) : (
													<TextField
														sx={{ py: 1, width: '100%', minWidth: 0 }}
														variant='standard'
														color='primary'
														value={query.valor ?? ''}
														onChange={(e) => {
															dispatch({
																type: reporteReducerTypes.UPDATE_QUERY_VALOR,
																payload: {
																	index,
																	valor: e.target.value,
																},
															});
														}}
													/>
												)}
											</Box>
										);
									})}
								</Box>

								<Box>
									<Button variant='contained' type='submit'>
										Generar reporte
									</Button>
								</Box>
							</form>
						</>
					</Content>
				</Card>
			</ContentWithTitle>
		</>
	);
};

export default FormReporte;
