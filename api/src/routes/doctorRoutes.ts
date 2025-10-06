import express from "express";
import doctorController from "../controller/doctorController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Rotas de usuário
router.get("/", authMiddleware, doctorController.getAll);
router.get("/:id", authMiddleware, doctorController.getById);
router.post("/register", authMiddleware, doctorController.register);
router.put("/update", authMiddleware, doctorController.updateDoctor);
router.delete("/delete/:id", authMiddleware, doctorController.delete);

export default router;
