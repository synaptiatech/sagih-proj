import { Box, Button, Card, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import swal from 'sweetalert';
import { URI } from '../../../consts/Uri';
import { TransactContext } from '../../../contexts/TransactProvider';
import { transactTypes } from '../../../hooks/transactReducer';
import { TranDetalleType } from '../../../props/ReservaProps';
import { dataDelete, dataPost } from '../../../services/fetching.service';
import FilasBox from '../../../utils/FilasFlex';
import { handleError } from '../../../utils/HandleError';
import { TextOnlyRead } from '../../input/Input';
import MiTabla from '../../show/Table';
import TrancDetalle from '../../transaccion/Detalle';
import { formatDate, formatTime } from '../../../utils/Formateo';

export type FormRoomServicesProps = {
	onClose: () => void;
};

const FormRoomServices: React.FC<FormRoomServicesProps> = ({ onClose }) => {
	const { state, dispatch } = useContext(TransactContext);
	const [detalle, setDetalle] = useState({} as TranDetalleType);

	const handleEditDetalle = (row: any, index: number) => {
		if (row.servicio === 1) {
			handleError('No se puede editar el servicio de habitación', {});
			return;
		}
		setDetalle(row);
	};

	const handleDeleteDetalle = async (row: any, index: number) => {
		try {
			if (row.servicio === 1) {
				throw new Error(
					'No se puede eliminar el servicio de habitación'
				);
			}
			if (row.codigo) {
				await dataDelete({
					path: `${URI.transaccion}/detalle`,
					params: { codigo: row.codigo },
				});
				dispatch({
					type: transactTypes.REMOVE_TRAN_DETALLE,
					payload: row,
				});
			} else {
				dispatch({
					type: transactTypes.REMOVE_TRAN_DETALLE,
					payload: row,
				});
			}
		} catch (error) {
			handleError('Error al eliminar el detalle', error);
		}
	};

	const onSave = async () => {
		try {
			console.log('onSave', state.tranDetalle);
			const habitacion = state.habitacion.codigo;
			await dataPost({
				path: `${URI.transaccion}/detalle`,
				data: state.tranDetalle
					.filter(
						(detalle) =>
							detalle.codigo === 0 || detalle.codigo === undefined
					)
					.map((detalle) => ({
						...detalle,
						habitacion,
					})),
			});
			swal(
				'Guardado',
				'Se han guardado los servicios agregados',
				'success'
			);
			onClose();
		} catch (error) {
			handleError('Error al guardar el detalle', error);
		}
	};

	return (
		<Box>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					p: 2,
				}}>
				<Typography variant='h6' component='h2'>
					Servicios a la habitación
				</Typography>
				<FilasBox>
					<>
						<TextOnlyRead
							label='Transacción'
							value={state.tranCorrelativo.tipo_transaccion}
						/>
						<TextOnlyRead
							label='Serie'
							value={state.tranCorrelativo.serie}
						/>
						<TextOnlyRead
							label='Correlativo'
							value={state.tranCorrelativo.documento}
						/>
						<TextOnlyRead
							label='Habitacion'
							value={state.habitacion?.nombre}
						/>
						<TextOnlyRead
							label='Tipo'
							value={state.habitacion?.th_nombre}
						/>
					</>
				</FilasBox>
				<FilasBox>
					<>
						<TextOnlyRead
							label='Fecha de ingreso'
							value={formatDate(
								new Date(state.tranEncabezado.fecha_ingreso)
							)}
						/>
						<TextOnlyRead
							label='Hora de ingreso'
							value={formatTime(
								new Date(state.tranEncabezado.fecha_ingreso)
							)}
						/>
						<TextOnlyRead
							label='Fecha de salida'
							value={formatDate(
								new Date(state.tranEncabezado.fecha_salida)
							)}
						/>
						<TextOnlyRead
							label='Hora de salida'
							value={formatTime(
								new Date(state.tranEncabezado.fecha_salida)
							)}
						/>
					</>
				</FilasBox>
				<TrancDetalle
					detalle={detalle}
					clearDetalle={() => setDetalle({} as TranDetalleType)}
				/>
				<Box sx={{ alignSelf: 'flex-end' }}>
					<Button
						variant='contained'
						color='primary'
						onClick={onSave}>
						Guardar cambios
					</Button>
				</Box>
				<Box
					sx={{
						height: 350,
						overflowY: 'auto',
					}}>
					<MiTabla
						headers={{
							servicio: 'Servicio',
							descripcion: 'Detalle',
							precio: 'Precio',
							cantidad: 'cantidad',
							subtotal: 'subtotal',
						}}
						rows={state?.tranDetalle || []}
						sumatoria='subtotal'
						onEdit={handleEditDetalle}
						onDelete={handleDeleteDetalle}
					/>
				</Box>
			</Card>
		</Box>
	);
};

export default FormRoomServices;
