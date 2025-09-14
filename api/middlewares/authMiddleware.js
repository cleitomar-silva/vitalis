import jwt from 'jsonwebtoken';
import { SECRET } from "../secretJWT.js";
import User from "../models/userModel.js";
import { inverterDataHora } from "../utils/utils.js";



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

    // 2️⃣ Token válido, adiciona info do usuário na requisição
   // req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      empresaId: decoded.empresaId
    };   

    // 3️⃣ atualizar last seen
    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })); 

    User.updateLastSeen({ userId: req.user.id, lastSeen: timeZoneNow }, (err) => {
      if (err) console.error("Erro ao atualizar presença:", err);
    });



    next();
  });
};
