import { Router } from 'express';
import { login, logout, getProfile, validateSession } from '../controllers/authController';

const router = Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.get('/validate', validateSession);

export default router;
