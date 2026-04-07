import { Router } from 'express';
import {
	createPago,
	deletePago,
	getAllPago,
	getPago,
	getTiposPago,
	updatePago,
} from '../controllers/pago.controller.js'; 

const router = Router();

router.get('/', getPago);
router.get('/tipos', getTiposPago);
router.post('/all', getAllPago);
router.post('/', createPago);
router.put('/', updatePago);
router.delete('/', deletePago);

export default router;
