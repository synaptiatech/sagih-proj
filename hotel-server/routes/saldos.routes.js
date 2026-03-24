import { Router } from 'express';
import {
	deleteItem,
	getItem,
	getItems,
	insertItem,
	updateItem,
} from '../controllers/saldos.controller.js';

const router = Router();

router.post('/one', getItem);
router.post('/all', getItems);
router.post('/', insertItem);
router.put('/', updateItem);
router.delete('/', deleteItem);

export default router;
