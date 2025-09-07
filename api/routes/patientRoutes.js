import express from 'express';
const router = express.Router();
import patientController from '../controllers/patientController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

router.post('/register',authMiddleware, patientController.register);
router.get('/',authMiddleware, patientController.getAllPatient);
router.get('/:id',authMiddleware, patientController.getPatientById);
router.put('/update',authMiddleware, patientController.updatePatient );
router.delete('/delete/:id',authMiddleware, patientController.deletePatient );




export default  router;
