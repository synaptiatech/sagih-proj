import { Router } from 'express';
import {
	getImpuesto,
	getAllImpuesto,
	createImpuesto,
	updateImpuesto,
	deleteImpuesto,
} from '../controllers/impuesto.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', getImpuesto);
router.post('/', createImpuesto);
router.post('/all', [ensureAuth], getAllImpuesto);
router.put('/', updateImpuesto);
router.delete('/', deleteImpuesto);

export default router;
