import { Router } from 'express';
import {
	createServicios,
	createTipoServicios,
	deleteServicios,
	deleteTipoServicios,
	getAllServicios,
	getAllTipoServicios,
	getDataForReportes,
	getParametros,
	getServicio,
	getServicioByFiltering,
	getTipoServicio,
	updateServicios,
	updateTipoServicios,
} from '../controllers/servicio.controller.js';

const router = Router();

router.get('/tipo', getTipoServicio);
router.post('/tipo', createTipoServicios);
router.post('/tipo/all', getAllTipoServicios);
router.put('/tipo', updateTipoServicios);
router.delete('/tipo', deleteTipoServicios);

router.get('/parametros', getParametros);
router.get('/filter', getServicioByFiltering);
router.get('/', getServicio);
router.post('/reportes', getDataForReportes);
router.post('/all', getAllServicios);
router.post('/', createServicios);
router.put('/', updateServicios);
router.delete('/', deleteServicios);

export default router;
