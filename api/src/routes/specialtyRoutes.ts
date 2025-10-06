import express from "express";
import specialtyController from "../controller/specialtyController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, specialtyController.getAll);
router.get("/:id", authMiddleware, specialtyController.getById);
router.post("/register", authMiddleware, specialtyController.register);
router.put("/update", authMiddleware, specialtyController.update);
router.delete("/delete/:id", authMiddleware, specialtyController.delete);

export default router;
