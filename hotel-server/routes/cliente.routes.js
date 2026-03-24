import { Router } from 'express';
import {
	createCliente,
	deleteCliente,
	getAllClientes,
	getCliente,
	getDataForReportes,
	getFilteredClientes,
	getParametros,
	updateCliente,
} from '../controllers/cliente.controller.js';

const router = Router();

router.get('/parametros', getParametros);
router.get('/filter', getFilteredClientes);
router.get('/reportes', getDataForReportes);
router.get('/', getCliente);
router.post('/all', getAllClientes);
router.post('/', createCliente);
router.put('/', updateCliente);
router.delete('/', deleteCliente);

export default router;
