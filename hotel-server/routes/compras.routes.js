import { Router } from 'express';
import {
	createCompras,
	deleteCompras,
	getCompra,
	getCompras,
	updateCompras,
} from '../controllers/compras.controller.js';

const router = Router();

router.get('/', getCompra);
router.post('/all', getCompras);
router.post('/', createCompras);
router.put('/', updateCompras);
router.delete('/', deleteCompras);

export default router;
