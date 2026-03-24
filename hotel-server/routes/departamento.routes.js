import { Router } from 'express';

import {
	getDepartamento,
	getDepartamentos,
	createDepartamento,
	getParametros,
	updateDepartamento,
	deleteDepartamento,
} from '../controllers/departamento.controller.js';

const router = Router();

router.get('/parametros', getParametros);
router.get('/', getDepartamento);
router.post('/all', getDepartamentos);
router.post('/', createDepartamento);
router.put('/', updateDepartamento);
router.delete('/', deleteDepartamento);

export default router;
