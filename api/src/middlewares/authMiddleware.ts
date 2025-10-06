import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET } from "../utils/secretJWT";
import UserModel from "../model/User";
import { inverterDataHora } from "../utils/utils";
import { AuthRequest } from "./authMiddlewareTypes"; // se você separar o tipo em um arquivo

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["x-access-token"] as string;

    if (!token) return res.status(403).json({ message: "Token não fornecido." });

    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    req.user = {
      id: decoded.userId as number,
      empresaId: decoded.empresaId as number
    };

    // Atualizar lastSeen
    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));

    await UserModel.updateLastSeen(req.user.id, new Date(timeZoneNow));

    next();
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};
