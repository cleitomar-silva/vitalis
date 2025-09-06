import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.post('/register',authMiddleware, userController.register);
router.get('/',authMiddleware, userController.getAllUsers);
router.get('/:id',authMiddleware, userController.getUserById);
router.post('/login', userController.login);
// TODO update e delete



export default  router;
