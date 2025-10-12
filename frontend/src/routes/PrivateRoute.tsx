import React, { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = Cookies.get("auth_token_vitalis");
  const navigate = useNavigate();

  // Checagem em tempo real (opcional)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = Cookies.get("auth_token_vitalis");
      if (!token) {
        navigate("/sair", { replace: true });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  // Se não houver token, redireciona imediatamente
  if (!token) {
    return <Navigate to="/sair" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
