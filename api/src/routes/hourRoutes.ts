import express from "express";
import hourController from "../controller/hourController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, hourController.getAll);
router.get("/:id", authMiddleware, hourController.getById);
router.post("/register", authMiddleware, hourController.register);
router.put("/update", authMiddleware, hourController.update);
router.delete("/delete/:id", authMiddleware, hourController.delete);

export default router;
