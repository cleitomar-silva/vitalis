import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const isAuth = true// localStorage.getItem("token"); // Exemplo simples
  return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
