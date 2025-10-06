import { Request } from "express";

// Interface para Requests autenticadas
export interface AuthRequest extends Request {
  user?: {
    id: number;
    empresaId: number;
  };
}
