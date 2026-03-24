import { Router } from 'express';
import {
	createProducto,
	deleteProducto,
	getProductos,
	getProducto,
	updateProducto,
} from '../controllers/producto.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', [ensureAuth], getProducto);
router.post('/all', [ensureAuth], getProductos);
router.post('/', [ensureAuth], createProducto);
router.put('/', [ensureAuth], updateProducto);
router.delete('/', [ensureAuth], deleteProducto);

export default router;
