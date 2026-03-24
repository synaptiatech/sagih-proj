import { Router } from 'express';

import {
	createArea,
	createHabitacion,
	createNivel,
	createTipo,
	deleteArea,
	deleteHabitacion,
	deleteNivel,
	deleteTipo,
	getAllANivel,
	getAllATipo,
	getAllAreas,
	getAllHabitacions,
	getArea,
	getHabitacion,
	getNivel,
	getParametros,
	getTipo,
	updateArea,
	updateHabitacion,
	updateNivel,
	updateTipo,
} from '../controllers/habitacion.controller.js';

const router = Router();

router.get('/area', getArea);
router.post('/area', createArea);
router.post('/area/all', getAllAreas);
router.put('/area', updateArea);
router.delete('/area', deleteArea);

router.get('/tipo', getTipo);
router.post('/tipo', createTipo);
router.post('/tipo/all', getAllATipo);
router.put('/tipo', updateTipo);
router.delete('/tipo', deleteTipo);

router.get('/nivel', getNivel);
router.post('/nivel', createNivel);
router.post('/nivel/all', getAllANivel);
router.put('/nivel', updateNivel);
router.delete('/nivel', deleteNivel);

router.get('/parametros', getParametros);
router.get('/', getHabitacion);
router.post('/', createHabitacion);
router.post('/all', getAllHabitacions);
router.put('/', updateHabitacion);
router.delete('/', deleteHabitacion);

export default router;
