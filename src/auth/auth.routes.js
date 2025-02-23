import { Router } from 'express';
import { login, register } from './auth.controller.js';
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { deleteFileOnError } from '../middlewares/delete-file-on-error.js';

const router = Router();

router.post(
    '/login',
    loginValidator,
    deleteFileOnError,
    login
);

router.post(
    '/register',
    registerValidator,
    deleteFileOnError,
    register
);

export default router;