import { Router } from 'express';
import { ensureAuth } from '../middlewares/auth.js';
import {
	createItem,
	deleteItem,
	getItem,
	getItems,
	updateItem,
} from '../controllers/cierre.controller.js';

const router = Router();

router.post('/one', ensureAuth, getItem);
router.post('/all', ensureAuth, getItems);
router.post('/', ensureAuth, createItem);
router.post('/', ensureAuth, updateItem);
router.post('/', ensureAuth, deleteItem);

export default router;
