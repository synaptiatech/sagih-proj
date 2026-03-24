import { Router } from 'express';
import {
	createPagina,
	deletePagina,
	getAllPagina,
	getPagina,
	updatePagina,
} from '../controllers/pagina.controller.js';

const router = Router();

router.get('/', getPagina);
router.post('/all', getAllPagina);
router.post('/', createPagina);
router.put('/', updatePagina);
router.delete('/', deletePagina);

export default router;
