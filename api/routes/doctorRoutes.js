import express from 'express';
const router = express.Router();
import doctorController from '../controllers/doctorController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


router.post('/register',authMiddleware, doctorController.register);
router.get('/',authMiddleware, doctorController.getAllDoctor);
router.get('/:id',authMiddleware, doctorController.getDoctorById);
// TODO update e delete


export default  router;