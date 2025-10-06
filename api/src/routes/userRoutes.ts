import express from "express";
import userController from "../controller/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Rotas de usuário
router.post("/register", authMiddleware, userController.register);
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.post("/login", userController.login);
router.put("/update", authMiddleware, userController.updateUser);
router.delete("/delete/:id", authMiddleware, userController.deleteUser);

export default router;
