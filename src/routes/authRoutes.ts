import { Router } from 'express';
import { login, register, logout, getProfile, validateSession } from '../controllers/authController';

const router = Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.get('/validate', validateSession);

export default router;
