import {
	Autocomplete,
	Box,
	Button,
	Card,
	TextField,
	Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import swal from 'sweetalert';
import { URI } from '../../../consts/Uri';
import { TransactContext } from '../../../contexts/TransactProvider';
import { transactTypes } from '../../../hooks/transactReducer';
import { useFetch } from '../../../hooks/useFetch';
import { RCDetType } from '../../../props/ReciboProps';
import { dataDelete, dataPost } from '../../../services/fetching.service';
import { gridStyle } from '../../../theme/FormStyle';
import { handleError } from '../../../utils/HandleError';
import { PickCorrelativo } from '../../transaccion/PickCorrelativo';
import { Recibo } from '../../transaccion/Recibo';
import { TranEncabezadoType } from '../../../props/ReservaProps';
import GridSkeleton from '../../layout/waiting';
import ErrorLayout from '../../layout/error';

type Option = {
	id: string;
	label: string;
};

const data: Option[] = [
	{ id: 'CI', label: 'Check-in' },
	{ id: 'RE', label: 'Reservación' },
];

export type FormRoomPaymentsProps = {
	onClose: () => void;
};

const FormRoomPayments: React.FC<FormRoomPaymentsProps> = ({ onClose }) => {
	const { state, dispatch } = useContext(TransactContext);
	const [tranEnc, settranEnc] = useState<TranEncabezadoType>(
		state.tranEncabezado
	);
	const [detalle, setDetalle] = useState({} as RCDetType);
	const {
		data: tranEncs,
		isLoading: isTranEncsLoading,
		isError: isTranEncsError,
	} = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'encabezado_transaccion',
		columns: {
			serie: 'Serie',
			tipo_transaccion: 'Tipo',
			documento: 'Documento',
			estado: 'Estado',
			cliente: 'Cliente',
			vendedor: 'Vendedor',
		},
		query: { tipo_transaccion: 'CI' },
		sort: { tipo_transaccion: 'ASC', serie: 'ASC', documento: 'ASC' },
		customWhere: [
			{
				column: 'saldo',
				operator: '<>',
				value: 0,
			},
		],
	});
	const {
		data: rcDets,
		isLoading: isRcDetsLoading,
		isError: isRcDetsError,
	} = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'detalle_recibo',
		query: {
			serie_fac: tranEnc?.serie || '',
			ti_tran_fac: tranEnc?.tipo_transaccion || '',
			documento_fac: tranEnc?.documento || 0,
		},
		sort: { fecha: 'ASC' },
	});
	const {
		data: tranDets,
		isLoading: isTranDetsLoading,
		isError: isTranDetsError,
	} = useFetch({
		path: `${URI.transaccion}/all`,
		table: 'detalle_transaccion',
		columns: {
			subtotal: 'Subtotal',
		},
		query: {
			serie: tranEnc?.serie || '',
			tipo_transaccion: tranEnc?.tipo_transaccion || '',
			documento: tranEnc?.documento || 0,
		},
	});

	const handleEditDetalle = (row: any) => {
		setDetalle(row);
	};

	const handleDeleteDetalle = async (row: any) => {
		try {
			if (row.codigo) {
				await dataDelete({
					path: `${URI.transaccion}/recibo`,
					params: { codigo: row.codigo },
				});
				dispatch({
					type: transactTypes.REMOVE_RC_DETALLE,
					payload: row,
				});
			} else {
				dispatch({
					type: transactTypes.REMOVE_RC_DETALLE,
					payload: row,
				});
			}
		} catch (error) {
			handleError('Error al eliminar el detalle', error);
		}
	};

	const onSave = async () => {
		try {
			await dataPost({
				path: `${URI.recibo}`,
				data: {
					rcDetalles: state.rcDetalle.filter(
						(detalle) =>
							detalle.codigo === 0 || detalle.codigo === undefined
					),
					tranEncabezado: tranEnc,
				},
			});
			swal('Guardado', 'El recibo se guardó correctamente', 'success');
		} catch (error) {
			handleError('Error al guardar el recibo', error);
		}
	};

	useEffect(() => {
		if (rcDets !== undefined) {
			dispatch({
				type: transactTypes.SET_RC_DETALLE,
				payload: rcDets.rows,
			});
		}
	}, [isRcDetsLoading]);

	useEffect(() => {
		if (tranDets !== undefined) {
			dispatch({
				type: transactTypes.SET_TRAN_DETALLE,
				payload: tranDets.rows,
			});
		}
	}, [isTranDetsLoading]);

	if (isTranEncsLoading) return <GridSkeleton />;
	if (isTranEncsError)
		return <ErrorLayout error='No se pudo cargar las transacciones' />;

	if (isRcDetsLoading) return <GridSkeleton />;
	if (isRcDetsError)
		return <ErrorLayout error='No se pudo cargar los recibos' />;

	return (
		<Box>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					p: 2,
				}}>
				<Typography variant='h6'>Pagos realizados</Typography>
				<Box sx={gridStyle}>
					<Typography variant='h6'>Transacción</Typography>
					{/* PICK TRANSACCIÓN */}
					<Autocomplete
						options={tranEncs?.rows || []}
						getOptionLabel={(option) =>
							`${option.tipo_transaccion}-${option.serie}-${option.documento}`
						}
						value={tranEnc?.serie ? tranEnc : null}
						onChange={(e, value) => {
							if (value) {
								settranEnc(value);
								dispatch({
									type: transactTypes.SET_TRAN_CORRELATIVO,
									payload: {
										tipo_transaccion:
											value.tipo_transaccion,
										serie: value.serie,
										documento: value.documento,
									},
								});
							}
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label='Transacción'
								variant='outlined'
							/>
						)}
					/>
					<Typography variant='h6'>Recibo</Typography>
					<PickCorrelativo
						action={transactTypes.SET_RC_CORRELATIVO}
						siguiente={state.rcCorrelativo.documento || 0}
						titran='RC'
					/>
					<Recibo />
					<Button variant='contained' onClick={onSave}>
						Finalizar pagos
					</Button>
				</Box>
			</Card>
		</Box>
	);
};

export default FormRoomPayments;
