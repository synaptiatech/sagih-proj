import { Router } from 'express';
import {
	getPerfil,
	createPerfil,
	deletePerfil,
	getAllPerfil,
	updatePerfil,
} from '../controllers/perfil.controller.js';
const router = Router();

router.get('/', getPerfil);
router.post('/all', getAllPerfil);
router.post('/', createPerfil);
router.put('/', updatePerfil);
router.delete('/', deletePerfil);

export default router;
