import { Router } from 'express';
import { getItem, getItems } from '../controllers/general.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/', ensureAuth, getItem);
router.post('/all', ensureAuth, getItems);

export default router;
