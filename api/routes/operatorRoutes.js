import express from 'express';
const router = express.Router();
import operatorController from '../controllers/operatorController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/', authMiddleware, operatorController.getAll);
router.get('/:id', authMiddleware, operatorController.getById);
router.post('/register', authMiddleware, operatorController.register);
router.put('/update',authMiddleware, operatorController.update );
router.delete('/delete/:id',authMiddleware, operatorController.delete );

export default router;