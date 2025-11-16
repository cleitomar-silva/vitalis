import React, { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { can } from "../utils/auth";

interface RouteProtegidaProps {
  page: string;        // nome da página para verificar permissão
  children: ReactNode; // aceita 1 ou múltiplos elementos
}

export const PrivateRoute: React.FC<RouteProtegidaProps> = ({ page, children }) => {
  const token = Cookies.get("auth_token_vitalis");
  const navigate = useNavigate();

  // Checagem em tempo real opcional
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = Cookies.get("auth_token_vitalis");
      if (!token) {
        navigate("/sair", { replace: true });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  // 1️⃣ Verifica se está logado
  if (!token) {
    return <Navigate to="/sair" replace />;
  }

  

  // 2️⃣ Verifica se tem permissão
  if (!can(page, "per_view")) {
    
    return <Navigate to="/sem-acesso" replace />;
  }

  // 3️⃣ Renderiza os filhos
  return <>{children}</>;
};

export default PrivateRoute;