import jwt from 'jsonwebtoken';
import { SECRET } from "../secretJWT.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'];

  // 1️⃣ Verifica se o token foi fornecido
  if (!token) {
    return res.status(403).json({
      message: "Token não fornecido."
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Token inválido ou expirado."
      });
    }

    // 3️⃣ Token válido, adiciona info do usuário na requisição
    req.userId = decoded.userId;
    next();
  });
};
