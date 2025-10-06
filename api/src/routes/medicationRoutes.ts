import express from "express";
import medicationController from "../controller/medicationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, medicationController.getAll);
router.get("/:id", authMiddleware, medicationController.getById);
router.post("/register", authMiddleware, medicationController.register);
router.put("/update", authMiddleware, medicationController.update);
router.delete("/delete/:id", authMiddleware, medicationController.delete);

export default router;
