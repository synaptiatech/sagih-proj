import { Router } from 'express';
import {
	createUsuario,
	deleteUsuario,
	getUsuario,
	getUsuarios,
	login,
	loginWithGoogle,
	recoveryPassword,
	updatePerfilUsuario,
	updateUsuario,
} from '../controllers/usuario.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/login', login);
router.post('/google-login', loginWithGoogle);
router.get('/', ensureAuth, getUsuario);
router.get('/recovery', recoveryPassword);
router.post('/all', ensureAuth, getUsuarios);
router.post('/', ensureAuth, createUsuario);
router.put('/', ensureAuth, updateUsuario);
router.put('/perfil/', ensureAuth, updatePerfilUsuario);
router.delete('/', ensureAuth, deleteUsuario);

export default router;
