import { Router } from 'express';
import {
	setItem,
	getItem,
	uploadImage,
	getImage,
	getOneItem,
} from '../controllers/empresa.controller.js';
const router = Router();

router.get('/', getOneItem);
router.get('/image', getImage);
router.post('/get', getItem);
router.post('/upload', uploadImage);
router.post('/', setItem);

export default router;
