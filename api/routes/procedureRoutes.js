import express from 'express';
const router = express.Router();
import procedureController from '../controllers/procedureController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.get('/',authMiddleware, procedureController.getAll);
router.get('/:id',authMiddleware, procedureController.getById);
router.post('/register',authMiddleware, procedureController.register);
router.put('/update',authMiddleware, procedureController.update );
router.delete('/delete/:id',authMiddleware, procedureController.delete );

export default  router;
