import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.post('/register',authMiddleware, userController.register);
router.get('/',authMiddleware, userController.getAllUsers);
router.get('/:id',authMiddleware, userController.getUserById);
router.post('/login', userController.login);
router.put('/update',authMiddleware, userController.update);
// TODO update e delete users
// crud patient



export default  router;
