import { Router } from 'express';
import {
	createVendedor,
	deleteVendedor,
	getAllVendedor,
	getFilteredVendedor,
	getVendedor,
	updateVendedor,
} from '../controllers/vendedor.controller.js';

const router = Router();

router.get('/filter', getFilteredVendedor);
router.get('/one', getVendedor);
router.post('/all', getAllVendedor);
router.post('/', createVendedor);
router.put('/', updateVendedor);
router.delete('/', deleteVendedor);

export default router;
