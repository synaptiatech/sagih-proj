import { yupResolver } from '@hookform/resolvers/yup';
import {
	Box,
	Button,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import dayjs, { locale } from 'dayjs';
import React, { lazy, useContext, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { URI } from '../../consts/Uri';
import { TransactContext } from '../../contexts/TransactProvider';
import { transactTypes } from '../../hooks/transactReducer';
import {
	TranDetalleType,
	TranEncabezadoType,
	schemaEditReserva,
	schemaReserva,
	tranEncDefault,
} from '../../props/ReservaProps';
import {
	dataDelete,
	dataPost,
	dataUpdate,
} from '../../services/fetching.service';
import FilasBox from '../../utils/FilasFlex';
import { inputFormatValue } from '../../utils/Formateo';
import { handleError } from '../../utils/HandleError';
import { TextOnlyRead } from '../input/Input';
import { PickHabitacion } from '../transaccion/PickHabitacion';
const TrancPdf = lazy(() => import('../show/TrancPdf'));
const TrancDetalle = lazy(() => import('../transaccion/Detalle'));
const PickCliente = lazy(
	() => import('../transaccion/PickCliente/PickCliente')
);
const PickCorrelativo = lazy(
	() => import('../transaccion/PickCorrelativo/PickCorrelativo')
);
const PickVendedor = lazy(
	() => import('../transaccion/PickVendedor/PickVendedor')
);
const Recibo = lazy(() => import('../transaccion/Recibo/Recibo'));
const MiModal = lazy(() => import('../show/MiModal'));
const RcPdf = lazy(() => import('../show/RcPdf'));
const MiTabla = lazy(() => import('../show/Table'));

const compareDate = (strDateA: string, strDateB: string) => {
	const dateA: Date = strDateA ? new Date(strDateA) : new Date();
	const dateB: Date = strDateB ? new Date(strDateB) : new Date();

	dateA.setHours(0, 0, 0, 0);
	dateB.setHours(0, 0, 0, 0);

	if (dateA.getTime() < dateB.getTime()) return -1;
	if (dateA.getTime() > dateB.getTime()) return 1;
	return 0;
};

export type FormReservaProps = {
	onClose: () => void;
};

const formatDate = (strTimestamp?: string) => {
	return strTimestamp
		? dayjs(strTimestamp).format('YYYY-MM-DD')
		: dayjs().format('YYYY-MM-DD');
};

const formatTime = (strTimestamp?: string) => {
	return strTimestamp
		? dayjs(strTimestamp).format('HH:mm')
		: dayjs().format('HH:mm');
};

const formatOutTime = (strInTimestamp?: string, strOutTimestamp?: string) => {
	let inDate = dayjs(strInTimestamp);
	let outDate = strOutTimestamp ? dayjs(strOutTimestamp) : dayjs();

	let time = dayjs();

	// INGRESO === SALIDA ? 23:XX : 13:XX
	if (inDate.isSame(outDate, 'day')) {
		time.set('hour', 23);
		time.set('minute', 59);
	} else {
		time.set('hour', 13);
		time.set('minute', 0);
	}

	return time.format('HH:mm');
};

const FormReserva: React.FC<FormReservaProps> = ({ onClose }) => {
	const { state, dispatch } = useContext(TransactContext);
	const [detalle, setDetalle] = useState<TranDetalleType>(
		{} as TranDetalleType
	);
	const [openModal, setOpenModal] = useState('');

	const {
		control,
		setValue,
		getValues,
		reset,
		handleSubmit,
		formState: { errors, isDirty },
	} = useForm<TranEncabezadoType>({
		defaultValues: {
			fecha_ingreso: state?.tranEncabezado?.fecha_ingreso
				? dayjs(
						state.tranEncabezado?.fecha_ingreso,
						'YYYY-MM-DDThh:mm:ss.SSSZ'
				  ).format('YYYY-MM-DD')
				: dayjs().format('YYYY-MM-DD'),
			hora_ingreso: formatTime(state?.tranEncabezado?.fecha_ingreso),
			fecha_salida: state?.tranEncabezado?.fecha_salida
				? dayjs(
						state.tranEncabezado.fecha_salida,
						'YYYY-MM-DDThh:mm:ss.SSSZ'
				  ).format('YYYY-MM-DD')
				: dayjs().format('YYYY-MM-DD'),
			hora_salida: formatOutTime(
				state?.tranEncabezado?.fecha_ingreso,
				state?.tranEncabezado?.fecha_salida
			),

			numero_personas: state.tranEncabezado?.numero_personas || 0,
			tipo_cambio: 1,
			subtotal: Number(state.habitacion.precio),
			abono: 0,
		},
		resolver: yupResolver(
			state.mode === 'CREATE' ? schemaReserva : schemaEditReserva
		),
		mode: 'onBlur',
	});

	const handleCreate = async (dataSend: any) => {
		try {
			await dataPost({
				path: `${URI.transaccion}`,
				data: dataSend,
			});
			swal(
				'Transacción guardada',
				`Transacción guardada exitosamente`,
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar transacción', error);
		}
	};

	const handleUpdate = async (dataSend: any) => {
		try {
			// TODO: Checkin.fecha > Cierre.fecha
			await dataUpdate({
				path: URI.transaccion,
				data: dataSend,
				params: {},
			});
			swal({
				title: 'Transacción guardada',
				text: `Transacción guardada exitosamente`,
				icon: 'success',
			});
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar transacción', error);
		}
	};

	const handleClose = async (dataSend: any) => {
		try {
			console.log('check out', dataSend);
			await dataPost({
				path: `${URI.transaccion}/close`,
				data: { ...dataSend, operacion: 'CO' },
			});
			swal(
				'Transacción guardada',
				`Transacción guardada exitosamente`,
				'success'
			);
			reset();
			onClose();
		} catch (error) {
			handleError('Error al guardar transacción', error);
		}
	};

	const handleEditDetalle = async (row: any, index: number) => {
		// if (row.servicio === 1) {
		// 	handleError('No se puede editar una habitación', {});
		// 	return;
		// }
		console.log(`Edit detail ${index}`);
		setDetalle(row);
	};

	const handleDeleteDetalle = async (row: any, index: number) => {
		try {
			if (row.servicio === 1) {
				throw new Error(
					'No se puede eliminar el servicio de habitación'
				);
			}

			const indexRow = state.tranDetalle.indexOf(row);
			const detalles = Object.assign([], state.tranDetalle);
			detalles.splice(indexRow, 1);
			console.log('detalles', detalles);

			if (row.codigo) {
				swal({
					title: '¿Está seguro?',
					text: 'Una vez eliminado, no se podrá recuperar el servicio',
					icon: 'warning',
					buttons: ['Cancelar', 'Eliminar'],
					dangerMode: true,
				}).then(async (willDelete) => {
					if (!willDelete) return;

					const result = await dataDelete({
						path: `${URI.transaccion}/detalle`,
						params: { codigo: row.codigo },
					});
					if (result.status === 200) {
						swal(
							'Servicio eliminado',
							'El servicio ha sido eliminado',
							'success'
						);
					}
					dispatch({
						type: transactTypes.REMOVE_TRAN_DETALLE,
						payload: detalles,
					});
				});
			} else {
				dispatch({
					type: transactTypes.REMOVE_TRAN_DETALLE,
					payload: detalles,
				});
			}
		} catch (error) {
			handleError('No se puede eliminar el detalle', error);
		}
	};

	const dateChanged = () => {
		let fechaIngreso = getValues('fecha_ingreso');
		let fechaSalida = getValues('fecha_salida');

		let dias = dayjs(fechaSalida).diff(dayjs(fechaIngreso), 'day');

		if (dias === 0) {
			setValue('hora_salida', '23:59');
		} else if (dias < 0) {
			setValue('fecha_salida', fechaIngreso);
			setValue('hora_salida', '23:59');
		} else {
			setValue('hora_salida', '13:00');
		}
	};

	const changePrice = () => {
		let precio = getValues('subtotal');
		let fechaIngreso = getValues('fecha_ingreso');
		let fechaSalida = getValues('fecha_salida');

		let dias = dayjs(fechaSalida).diff(dayjs(fechaIngreso), 'day');

		if (dias < 0) return;

		dias = dias === 0 ? 1 : dias;

		dispatch({
			type: transactTypes.UPDATE_TRAN_DETALLE,
			payload: {
				...state.tranDetalle[0],
				servicio: 1,
				cantidad: dias,
				subtotal: dias * precio,
			},
		});
	};

	const cambioFechaIngreso = (event: any) => {
		let fechaIngreso = event.target.value;

		setValue('fecha_ingreso', fechaIngreso);
		dateChanged();
		changePrice();
	};

	const cambioFechaSalida = (event: any) => {
		const fechaSalida = event.target.value;

		setValue('fecha_salida', fechaSalida);
		dateChanged();
		changePrice();
	};

	const onSubmit: SubmitHandler<TranEncabezadoType> = async (data) => {
		console.log('Errors', Object.keys(isDirty).length);
		if (Object.keys(isDirty).length > 0) return;

		const dataSend = {
			...state,
			tranEncabezado: {
				...state.tranEncabezado,
				...data,
				fecha_ingreso: dayjs(data.fecha_ingreso).format('YYYY-MM-DD'),
				fecha_salida: dayjs(data.fecha_salida).format('YYYY-MM-DD'),
			},
		};
		if (state.mode === 'CREATE') handleCreate(dataSend);
		else if (state.mode === 'CLOSE') handleClose(dataSend);
		else handleUpdate(dataSend);
	};

	useEffect(() => {
		if (state.habitacion?.codigo !== 0) return;
		setValue('subtotal', state.habitacion.precio);
		dispatch({
			type: transactTypes.UPDATE_TRAN_DETALLE,
			payload: {
				...state.tranDetalle.find((item) => item.servicio === 1),
				subtotal: state.habitacion.precio,
			},
		});
	}, [state.habitacion]);

	return (
		<>
			<Box component='div' sx={{ overflowY: 'scroll' }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FilasBox>
						<>
							<Typography variant='h6' component='h2' my={2}>
								Formulario transacción
							</Typography>
							<TextOnlyRead
								label='Transacción'
								value={state.operacion}
							/>
							{state.mode === 'CREATE' ? (
								<PickCorrelativo
									action={transactTypes.SET_TRAN_CORRELATIVO}
									titran={state.operacion}
									siguiente={
										state.tranCorrelativo.documento || 0
									}
								/>
							) : (
								<>
									<TextOnlyRead
										label='Serie'
										value={state.tranCorrelativo.serie}
									/>
									<TextOnlyRead
										label='Correlativo'
										value={state.tranCorrelativo.documento}
									/>
								</>
							)}
							<TextOnlyRead
								label='Habitacion'
								value={state.habitacion?.nombre}
							/>
							<PickHabitacion titran='CI' />
							<TextOnlyRead
								label='Tipo'
								value={state.habitacion?.th_nombre}
							/>
							<Controller
								control={control}
								name='subtotal'
								render={({ field }) => (
									<TextField
										{...field}
										sx={{ width: 100 }}
										label='Precio por día'
										variant='standard'
										onChange={(event) => {
											const value = event.target.value;
											dispatch({
												type: transactTypes.CHANGE_HAB_PRICE,
												payload: { precio: value },
											});
											field.onChange(event);
										}}
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													Q.
												</InputAdornment>
											),
											readOnly: state.mode !== 'CREATE',
										}}
									/>
								)}
							/>
							<Controller
								name='numero_personas'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Número de personas'
										variant='standard'
										sx={{ width: '100px' }}
										InputProps={{
											readOnly: state.mode !== 'CREATE',
										}}
										InputLabelProps={{
											shrink: true,
										}}
										error={!!errors.numero_personas}
										helperText={
											errors.numero_personas
												? errors.numero_personas
														?.message
												: ''
										}
									/>
								)}
							/>
							<PickVendedor readOnly={state.mode === 'READ'} />
						</>
					</FilasBox>
					<FilasBox>
						<>
							<PickCliente readOnly={state.mode === 'READ'} />
							<Box sx={{ flex: 1 }} />
							<Controller
								name='fecha_ingreso'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Fecha de ingreso'
										variant='standard'
										type='date'
										value={field.value}
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{
											readOnly: state.mode !== 'CREATE',
										}}
										onChange={cambioFechaIngreso}
										error={!!errors.fecha_ingreso}
										helperText={
											errors.fecha_ingreso
												? errors.fecha_ingreso?.message
												: ''
										}
									/>
								)}
							/>
							<Controller
								name='hora_ingreso'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Hora de ingreso'
										variant='standard'
										type='time'
										value={inputFormatValue(
											'time',
											field.value
										)}
										sx={{ width: '120px' }}
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{ readOnly: true }}
									/>
								)}
							/>
							<Controller
								name='fecha_salida'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Fecha de salida'
										variant='standard'
										type='date'
										value={field.value}
										sx={{ width: 125 }}
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{
											readOnly:
												state.mode === 'CLOSE' ||
												state.mode === 'READ',
										}}
										onChange={cambioFechaSalida}
										error={!!errors.fecha_salida}
										helperText={
											errors.fecha_salida
												? errors.fecha_salida?.message
												: ''
										}
									/>
								)}
							/>
							<Controller
								name='hora_salida'
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Hora de salida'
										variant='standard'
										type='time'
										value={inputFormatValue(
											'time',
											field.value
										)}
										sx={{ width: '120px' }}
										InputLabelProps={{
											shrink: true,
										}}
										inputProps={{ readOnly: true }}
									/>
								)}
							/>
						</>
					</FilasBox>
					<FilasBox>
						<>
							<Typography>Datos de la factura</Typography>
							<TextOnlyRead
								label='Nombre'
								value={
									state.tranEncabezado?.nombre_factura || ''
								}
							/>
							<TextOnlyRead
								label='Nit'
								value={state.tranEncabezado.nit_factura || ''}
							/>
							<TextOnlyRead
								label='Dirección'
								value={
									state.tranEncabezado.direccion_factura || ''
								}
							/>
						</>
					</FilasBox>
					<FilasBox>
						<>
							<TextField
								label='Saldo'
								variant='standard'
								sx={{ width: '100px' }}
								inputProps={{ readOnly: true }}
								value={new Intl.NumberFormat('es-GT').format(
									state.tranDetalle.reduce((acc, cur) => {
										return (
											+acc +
											+`${cur.subtotal}`
												.replace('Q.', '')
												.replace(',', '')
										);
									}, 0) -
										state.rcDetalle.reduce((acc, cur) => {
											return (
												+acc +
												+`${cur.monto}`.replace(
													'Q. ',
													''
												)
											);
										}, 0)
								)}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											Q.
										</InputAdornment>
									),
								}}
							/>
							<Typography
								sx={{
									lineHeight: 3,
									fontWeight: 'bold',
								}}
								variant='body1'>
								RECIBO
							</Typography>
							{state.mode !== 'READ' && (
								<PickCorrelativo
									action={transactTypes.SET_RC_CORRELATIVO}
									siguiente={
										state.rcCorrelativo.documento || 0
									}
									titran='RC'
								/>
							)}
							<Recibo onlyRead={state.mode === 'READ'} />
						</>
					</FilasBox>
					<FilasBox>
						<>
							<Button
								variant='outlined'
								color='secondary'
								type='button'
								onClick={() => setOpenModal('T')}>
								Vista previa check-in
							</Button>
							<Button
								variant='outlined'
								color='secondary'
								type='button'
								onClick={() => setOpenModal('R')}>
								Vista previa recibo
							</Button>
							<Box sx={{ flex: 1 }} />
							<Button
								variant='outlined'
								color='secondary'
								href='https://portal.sat.gob.gt/portal/#link-agenciavirtual'
								target='_blank'>
								Ir a SAT
							</Button>
							<Button
								variant='contained'
								color='primary'
								type='submit'
								disabled={state.mode === 'READ'}>
								{state.mode === 'CREATE'
									? state.tranCorrelativo.tipo_transaccion ===
									  'CI'
										? 'Check-in'
										: 'Reservar'
									: state.mode === 'UPDATE'
									? 'Guardar transacción'
									: 'Check-out'}
							</Button>
						</>
					</FilasBox>
				</form>
				{state.mode !== 'READ' && (
					<FilasBox>
						<>
							<TrancDetalle
								detalle={detalle}
								clearDetalle={() =>
									setDetalle({} as TranDetalleType)
								}
							/>
						</>
					</FilasBox>
				)}
				<MiTabla
					headers={{
						servicio: 'Servicio',
						descripcion: 'Detalle',
						precio: 'Precio',
						cantidad: 'cantidad',
						subtotal: 'subtotal',
					}}
					rows={state.tranDetalle || []}
					sumatoria='subtotal'
					onEdit={
						state.mode !== 'READ' ? handleEditDetalle : undefined
					}
					onDelete={
						state.mode !== 'READ' ? handleDeleteDetalle : undefined
					}
				/>
			</Box>
			<MiModal
				open={openModal !== ''}
				onClose={() => setOpenModal('')}
				size='m-large'>
				{openModal === 'T' ? (
					<TrancPdf
						tranEnc={{
							...tranEncDefault,
							numero_personas: getValues('numero_personas'),
							inguat: 0.1,
							iva: 0.12,
							total: +state.tranDetalle.reduce(
								(acc, cur) =>
									+acc +
									+`${cur.subtotal}`.replace('Q. ', ''),
								0
							),
						}}
					/>
				) : (
					<RcPdf />
				)}
			</MiModal>
		</>
	);
};

export default FormReserva;
