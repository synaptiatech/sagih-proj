import { Router } from 'express';
import {
	createFuncion,
	createTipoFuncion,
	deleteFuncion,
	deleteTipoFuncion,
	getAllFuncion,
	getAllTipoFuncion,
	getFuncion,
	getTipoFuncion,
	updateFuncion,
	updateTipoFuncion,
} from '../controllers/funcion.controller.js';

const router = Router();

router.get('/tipo', getTipoFuncion);
router.post('/tipo/all', getAllTipoFuncion);
router.post('/tipo', createTipoFuncion);
router.put('/tipo', updateTipoFuncion);
router.delete('/tipo', deleteTipoFuncion);

router.get('/', getFuncion);
router.post('/all', getAllFuncion);
router.post('/', createFuncion);
router.put('/', updateFuncion);
router.delete('/', deleteFuncion);

export default router;
