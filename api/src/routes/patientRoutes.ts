import express from 'express';
import patientController from '../controller/patientController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register',authMiddleware, patientController.register);
router.get('/',authMiddleware, patientController.getAllPatient);
router.get('/:id',authMiddleware, patientController.getPatientById);
router.put('/update',authMiddleware, patientController.updatePatient ); 
router.delete('/delete/:id',authMiddleware, patientController.deletePatient ); 

export default  router;
