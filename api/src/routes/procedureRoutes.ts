import express from "express";
import procedureController from "../controller/procedureController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, procedureController.getAll);
router.get("/:id", authMiddleware, procedureController.getById);
router.post("/register", authMiddleware, procedureController.register);
router.put("/update", authMiddleware, procedureController.update);
router.delete("/delete/:id", authMiddleware, procedureController.delete);

export default router;
