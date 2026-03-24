import { Router } from 'express';
import { getInfoApi } from '../controllers/index.controller.js';

var api = Router();

api.get('/', getInfoApi);

export default api;
