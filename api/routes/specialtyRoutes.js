import express from 'express';
const router = express.Router();
import specialtyController from '../controllers/specialtyController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.post('/register', authMiddleware, specialtyController.register);
router.get('/', authMiddleware, specialtyController.getAll);
router.get('/:id', authMiddleware, specialtyController.getById);
router.put('/update',authMiddleware, specialtyController.update );
router.delete('/delete/:id',authMiddleware, specialtyController.delete );

export default router;