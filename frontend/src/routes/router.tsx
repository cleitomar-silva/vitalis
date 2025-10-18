import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Users from "../pages/Users";
import Login from "../pages/Login";
// import Home from "../pages/Home";
import Exit from "../pages/Exit";
import Dashboard from "../pages/Dashboard";
import Service from "../pages/Service";
import Appointment from "../pages/Appointment";
import Report from "../pages/Report";
import Patient from "../pages/Patient";
import Doctor from "../pages/Doctor";
import Medication from "../pages/Medication";
import Specialty from "../pages/Specialty";
import Exam from "../pages/Exam";

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
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/sair",
          element: <Exit />,
        },
        {
          path: "/painel",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "/atendimento",
          element: (
            <PrivateRoute>
              <Service />
            </PrivateRoute>
          ),
        },
        {
          path: "/agendamento",
          element: (
            <PrivateRoute>
              <Appointment />
            </PrivateRoute>
          ),
        },
        {
          path: "/relatorio",
          element: (
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          ),
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
          path: "/pacientes",
          element: (
            <PrivateRoute>
              <Patient />
            </PrivateRoute>
          ),
        },
        {
          path: "/medicos",
          element: (
            <PrivateRoute>
              <Doctor />
            </PrivateRoute>
          ),
        },
        {
          path: "/medicamentos",
          element: (
            <PrivateRoute>
              <Medication />
            </PrivateRoute>
          ),
        },
        {
          path: "/especialidades",
          element: (
            <PrivateRoute>
              <Specialty />
            </PrivateRoute>
          ),
        },
        {
          path: "/exames",
          element: (
            <PrivateRoute>
              <Exam />
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
