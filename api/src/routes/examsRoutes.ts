import express from "express";
import examsController from "../controller/examsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, examsController.getAll);
router.get("/:id", authMiddleware, examsController.getById);
router.post("/register", authMiddleware, examsController.register);
router.put("/update", authMiddleware, examsController.update);
router.delete("/delete/:id", authMiddleware, examsController.delete);

export default router;
