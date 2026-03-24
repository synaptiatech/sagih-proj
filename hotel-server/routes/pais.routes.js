import { Router } from 'express';
import {
	getOnePais,
	getAllPaises,
	createPais,
	updatePais,
	deletePais,
} from '../controllers/pais.controller.js';

const router = Router();

router.get('/', getOnePais);
router.post('/all', getAllPaises);
router.post('/', createPais);
router.put('/', updatePais);
router.delete('/', deletePais);

export default router;
