import express from 'express';
const router = express.Router();
import examsController from '../controllers/examsController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/', authMiddleware, examsController.getAll);
router.get('/:id', authMiddleware, examsController.getById);
router.post('/register', authMiddleware, examsController.register);
router.put('/update',authMiddleware, examsController.update );
router.delete('/delete/:id',authMiddleware, examsController.delete );

export default router;