import { Router } from 'express';
import {
	deleteItem,
	getItem,
	getItems,
	postItem,
	putItem,
} from '../controllers/funcionalidad.controller.js';

const router = Router();

router.get('/', getItem);
router.post('/all', getItems);
router.post('/', postItem);
router.put('/', putItem);
router.delete('/', deleteItem);

export default router;
