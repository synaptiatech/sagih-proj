'use strict';

import { Router } from 'express';
import {
	createPago,
	deletePago,
	getAllPago,
	getPago,
	updatePago,
} from '../controllers/pago.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

var api = Router();

api.get('/', ensureAuth, getPago);
api.post('/all', ensureAuth, getAllPago);
api.post('/', ensureAuth, createPago);
api.put('/', ensureAuth, updatePago);
api.post('/delete', ensureAuth, deletePago);

export default api;
