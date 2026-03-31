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
											xs: 'repeat(1, 1fr)',
											sm: 'repeat(2, 2fr)',
											md: 'repeat(3, 3fr)',
										},
										mb: 2,
									}}
								>
									{state.queryFiltro.map((query, index) => (
										<Box
											key={`${query.columna}-${index}`}
											sx={{
												display: 'grid',
												gap: 2,
												gridTemplateColumns: {
													xs: '2fr 1fr',
													sm: '2fr 1fr 3fr',
												},
												alignItems: 'center',
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
													sx={{ py: 1 }}
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
													sx={{ py: 1 }}
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
											) : query.columna.includes('fecha') ? (
												<TextField
													sx={{ py: 1 }}
													type='date'
													variant='standard'
													color='primary'
													value={inputFormatValue(
														'date',
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
											) : (
												<TextField
													sx={{ py: 1 }}
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
									))}
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
