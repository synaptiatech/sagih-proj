import { Router } from 'express';
import {
	createDetalleTransaccion,
	createCorrelativo,
	createTransaccion,
	deleteDetalleTransaccion,
	deleteCorrelativo,
	deleteTransaccion,
	getAllDetalleTransaccion,
	getAllCorrelativo,
	getAllTransaccion,
	getDetalleTransaccion,
	getCorrelativoFiltered,
	getTransaccion,
	updateDetalleTransaccion,
	updateCorrelativo,
	updateTransaccion,
	getTransaccionByHabitacion,
	getCorrelativo,
	getTransaccionByDocumento,
	getDataForReports,
	closeTransaccion,
} from '../controllers/transaccion.controller.js';
import { ontime } from '../middlewares/ontime.js';
import { getAll, getFromQuery, getOne } from '../db/querys.js';

const router = Router();

router.get('/test', async (req, res) => {
	let result = await getOne('encabezado_transaccion', {});
	console.log({
		fecha_result: result.fecha_ingreso,
		date: new Date(result.fecha_ingreso).toLocaleDateString('es-GT'),
		time: new Date(result.fecha_ingreso).toLocaleTimeString('es-GT'),
	});
	res.status(200).json(result);
});

router.get('/correlativo/filter', getCorrelativoFiltered);
router.get('/correlativo', getCorrelativo);
router.post('/correlativo/all', getAllCorrelativo);
router.post('/correlativo', createCorrelativo);
router.put('/correlativo', updateCorrelativo);
router.delete('/correlativo', deleteCorrelativo);

router.get('/tipo', getTransaccion);
router.post('/tipo/all', getAllTransaccion);
router.post('/tipo', createTransaccion);
router.put('/tipo', updateTransaccion);
router.delete('/tipo', deleteTransaccion);

router.get('/detalle/filter', getDetalleTransaccion);
router.post('/detalle/all', getAllDetalleTransaccion);
router.post('/detalle', createDetalleTransaccion);
router.put('/detalle', updateDetalleTransaccion);
router.delete('/detalle', deleteDetalleTransaccion);

router.get('/habitacion', getTransaccionByHabitacion);
router.get('/documento', getTransaccionByDocumento);
router.get('/', getTransaccion);
router.post('/all', getAllTransaccion);
router.post('/reportes', getDataForReports);
router.post('/close', closeTransaccion);
router.post('/', createTransaccion);
router.put('/', updateTransaccion);
router.delete('/', ontime, deleteTransaccion);

export default router;
