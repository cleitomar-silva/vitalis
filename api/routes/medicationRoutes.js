import express from 'express';
const router = express.Router();
import medicationController from '../controllers/medicationController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/',authMiddleware, medicationController.getAll);
router.get('/:id',authMiddleware, medicationController.getById);
router.post('/register',authMiddleware, medicationController.register);
router.put('/update',authMiddleware, medicationController.update );
router.delete('/delete/:id',authMiddleware, medicationController.delete );




export default  router;
