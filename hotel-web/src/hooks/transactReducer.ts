import { CorrelativoType } from '../props/CorrelativoProps';
import { HabitacionType } from '../props/HabitacionProps';
import { RCDetType, RCEncType } from '../props/ReciboProps';
import { TranDetalleType, TranEncabezadoType } from '../props/ReservaProps';

enum transactTypes {
	// CONFIGURACION INICIAL
	SET_TRAN_DATA = 'SET_TRAN_DATA', // OK
	UPDATE_HABITACION = 'UPDATE_HABITACION', // OK

	// TRANSACCION
	SET_TRAN_CORRELATIVO = 'SET_TRAN_CORRELATIVO', // OK
	SET_TRAN_ENC = 'SET_TRAN_ENC',
	SET_TRAN_DETALLE = 'SET_TRAN_DETALLE',
	ADD_TRAN_DETALLE = 'ADD_TRAN_DETALLE',
	REMOVE_TRAN_DETALLE = 'REMOVE_TRAN_DETALLE',
	UPDATE_TRAN_DETALLE = 'UPDATE_TRAN_DETALLE',

	// RECIBO
	SET_RC_CORRELATIVO = 'SET_RC_CORRELATIVO', // OK
	SET_RC_ENC = 'SET_RC_ENC',
	ADD_RC_ENC = 'ADD_RC_ENC',
	REMOVE_RC_ENC = 'REMOVE_RC_ENC',

	SET_RC_DETALLE = 'SET_RC_DETALLE',
	ADD_RC_DETALLE = 'ADD_RC_DETALLE',
	REMOVE_RC_DETALLE = 'REMOVE_RC_DETALLE',
	UPDATE_RC_DETALLE = 'UPDATE_RC_DETALLE',

	SET_VENDEDOR = 'SET_VENDEDOR',
	SET_CLIENTE = 'SET_CLIENTE',
	SET_DETALLE = 'SET_DETALLE',
	CHANGE_HAB_PRICE = 'CHANGE_HAB_PRICE',

	RESET = 'RESET',
}

const transactDefault: transactState = {
	habitacion: {} as HabitacionType,
	tranCorrelativo: {} as CorrelativoType,
	tranEncabezado: {} as TranEncabezadoType,
	tranDetalle: [] as TranDetalleType[],
	rcCorrelativo: {} as CorrelativoType,
	rcEncabezado: {} as RCEncType,
	rcDetalle: [] as RCDetType[],
	operacion: '',
	mode: 'CREATE',
};

export interface transactState {
	habitacion: HabitacionType;
	tranCorrelativo: CorrelativoType;
	tranEncabezado: TranEncabezadoType;
	tranDetalle: TranDetalleType[];
	rcCorrelativo: CorrelativoType;
	rcEncabezado: RCEncType;
	rcDetalle: RCDetType[];
	operacion: string; // CI | CO | RE | L |
	mode: 'CREATE' | 'UPDATE' | 'READ' | 'CHANGE' | 'CLOSE';
}

interface transactAction {
	type: transactTypes;
	payload: any;
}

const transactReducer = (state: transactState, action: transactAction) => {
	const { type, payload } = action;

	switch (type) {
		case transactTypes.SET_TRAN_DATA:
			return {
				...state,
				habitacion: {
					...payload.habitacion,
					precio: `${payload.habitacion.precio || 0}`
						.replace('Q.', '')
						.trim(),
				},
				operacion: payload.operacion,
				tranCorrelativo: {
					...payload.tranCorrelativo,
					tipo_transaccion:
						payload.operacion ||
						payload.tranCorrelativo.tipo_transaccion,
				},
				tranEncabezado: payload.tranEnc,
				tranDetalle:
					payload.tranDetalle.length !== 0
						? payload.tranDetalle
						: [
								{
									codigo: -1,
									servicio: 1,
									descripcion: 'Alquiler de habitación',
									cantidad: 1,
									precio: payload.habitacion.precio,
									subtotal: payload.habitacion.precio,
									habitacion: payload.habitacion.codigo,
								},
						  ],
				rcEncabezado: payload.rcEnc,
				rcDetalle: payload.rcDetalle,
				mode: payload.mode || 'CREATE',
			};
		case transactTypes.UPDATE_HABITACION:
			return {
				...state,
				habitacion: {
					...payload,
					precio: `${payload.precio || 0}`.replace('Q.', '').trim(),
				},
			};
		case transactTypes.SET_TRAN_CORRELATIVO:
			return {
				...state,
				tranCorrelativo: { ...state.tranCorrelativo, ...payload },
			};
		case transactTypes.SET_TRAN_ENC:
			return {
				...state,
				tranEncabezado: {
					...state.tranEncabezado,
					...payload,
				},
			};
		case transactTypes.SET_TRAN_DETALLE:
			return {
				...state,
				tranDetalle: payload,
			};
		case transactTypes.ADD_TRAN_DETALLE:
			return {
				...state,
				tranDetalle:
					payload.servicio !== 1
						? [
								...state.tranDetalle,
								{
									serie: state.tranCorrelativo.serie,
									documento: state.tranCorrelativo.siguiente,
									tipo_transaccion:
										state.tranCorrelativo.tipo_transaccion,
									...payload,
								},
						  ]
						: state.tranDetalle,
			};
		case transactTypes.REMOVE_TRAN_DETALLE:
			return {
				...state,
				tranDetalle: payload,
			};
		case transactTypes.UPDATE_TRAN_DETALLE:
			console.log({ tranDetalle: state.tranDetalle, payload });
			return {
				...state,
				tranDetalle: state.tranDetalle.map((detalle: TranDetalleType) =>
					detalle.codigo === payload.codigo ||
					detalle.servicio === payload.servicio
						? payload
						: detalle
				),
			};
		case transactTypes.SET_RC_CORRELATIVO:
			return {
				...state,
				rcCorrelativo: { ...state.rcCorrelativo, ...payload },
			};
		case transactTypes.SET_RC_ENC:
			return {
				...state,
				rcEncabezado: payload,
			};
		case transactTypes.SET_RC_DETALLE:
			return {
				...state,
				rcDetalle: payload,
			};
		case transactTypes.ADD_RC_DETALLE:
			return {
				...state,
				rcDetalle: [
					...state.rcDetalle,
					{
						...payload,
						serie: state.rcCorrelativo.serie,
						documento: state.rcCorrelativo.siguiente,
						tipo_transaccion: state.rcCorrelativo.tipo_transaccion,
					},
				],
			};
		case transactTypes.REMOVE_RC_DETALLE:
			return {
				...state,
				rcDetalle: state.rcDetalle.filter(
					(item) => item.tipo_pago !== payload.tipo_pago
				),
			};
		case transactTypes.UPDATE_RC_DETALLE:
			return {
				...state,
				rcDetalle: state.rcDetalle.map((detalle: RCDetType) =>
					detalle.tipo_pago === payload.tipo_pago ? payload : detalle
				),
			};
		case transactTypes.SET_VENDEDOR:
			return {
				...state,
				tranEncabezado: {
					...state.tranEncabezado,
					vendedor: payload.codigo,
				},
			};
		case transactTypes.SET_CLIENTE:
			return {
				...state,
				tranEncabezado: {
					...state.tranEncabezado,
					...payload,
				},
			};
		case transactTypes.CHANGE_HAB_PRICE:
			return {
				...state,
				habitacion: { ...state.habitacion, ...payload },
				tranDetalle: state.tranDetalle.map((detalle: TranDetalleType) =>
					detalle.servicio === 1
						? {
								...detalle,
								precio: payload.precio,
								subtotal: payload.precio * detalle.cantidad,
						  }
						: detalle
				),
			};
		case transactTypes.SET_DETALLE:
			return {
				...state,
				tranEncabezado: {
					...state.tranEncabezado,
					detalle: payload,
				},
			};
		case transactTypes.RESET:
			return {
				...transactDefault,
			};
		default:
			return state;
	}
};

export { transactReducer, transactTypes, transactDefault };
