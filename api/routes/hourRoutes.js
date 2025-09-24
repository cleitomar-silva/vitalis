import express from 'express';
const router = express.Router();
import hourController from '../controllers/hourController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/', authMiddleware, hourController.getAll);
router.get('/:id', authMiddleware, hourController.getById);
router.post('/register', authMiddleware, hourController.register);
// router.put('/update',authMiddleware, hourController.update );
// router.delete('/delete/:id',authMiddleware, hourController.delete );

export default router;