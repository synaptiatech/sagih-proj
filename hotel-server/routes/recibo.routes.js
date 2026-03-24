import { Router } from 'express';
import {
	createDetalleRecibo,
	createRecibo,
	deleteDetalleRecibo,
	getAllDetalleRecibo,
	getAllRecibo,
	getDetalleRecibo,
	getRecibo,
	updateDetalleRecibo,
	updateRecibo,
} from '../controllers/recibo.controller.js';

const router = Router();

router.get('/', getRecibo);
router.post('/all', getAllRecibo);
router.post('/', createRecibo);
router.put('/', updateRecibo);
router.delete('/', deleteDetalleRecibo);

router.get('/detalle/', getDetalleRecibo);
router.post('/detalle/all', getAllDetalleRecibo);
router.post('/detalle/', createDetalleRecibo);
router.put('/detalle/', updateDetalleRecibo);
router.delete('/detalle/', deleteDetalleRecibo);

export default router;
