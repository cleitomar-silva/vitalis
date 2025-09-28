import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Users from "../pages/Users";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Sair from "../pages/Exit";
import Dashboard from "../pages/Dashboard";


import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        }, 
        {
          path: "/sair",
          element: <Sair />,
        }, 
        {
            path: "/usuarios",
            element: (
            <PrivateRoute>
                <Users />
            </PrivateRoute>
            ),
        },
        {
            path: "/painel",
            element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
            ),
        },
        
      ],
    },
  ],
  {
    basename: "", // alterar se for rodar em subpasta no deploy
  }
);

export default router;
