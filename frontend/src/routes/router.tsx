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
            <PrivateRoute page="painel">
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
            <PrivateRoute page="painel">
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "/atendimento",
          element: (
            <PrivateRoute page="atendimento">
              <Service />
            </PrivateRoute>
          ),
        },
        {
          path: "/agendamento",
          element: (
            <PrivateRoute page="agendamento">
              <Appointment />
            </PrivateRoute>
          ),
        },
        {
          path: "/relatorio",
          element: (
            <PrivateRoute page="relatorio">
              <Report />
            </PrivateRoute>
          ),
        },
        {
          path: "/usuario",
          element: (
            <PrivateRoute page="usuario">
              <Users />
            </PrivateRoute>
          ),
        },
        {
          path: "/paciente",
          element: (
            <PrivateRoute page="paciente">
              <Patient />
            </PrivateRoute>
          ),
        },
        {
          path: "/medico",
          element: (
            <PrivateRoute page="medico">
              <Doctor />
            </PrivateRoute>
          ),
        },
        {
          path: "/medicamento",
          element: (
            <PrivateRoute page="medicamento">
              <Medication />
            </PrivateRoute>
          ),
        },
        {
          path: "/especialidade",
          element: (
            <PrivateRoute page="especialidade">
              <Specialty />
            </PrivateRoute>
          ),
        },
        {
          path: "/exame",
          element: (
            <PrivateRoute page="exame">
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
