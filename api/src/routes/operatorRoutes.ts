import express from "express";
import operatorController from "../controller/operatorController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, operatorController.getAll);
router.get("/:id", authMiddleware, operatorController.getById);
router.post("/register", authMiddleware, operatorController.register);
router.put("/update", authMiddleware, operatorController.update);
router.delete("/delete/:id", authMiddleware, operatorController.delete);

export default router;
