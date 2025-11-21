import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    // Activity, CreditCard, FlaskConical, ListRestart, Circle, Clipboard, RotateCcw, StickyNote, Columns2, 
    LayoutDashboard, Users, Calendar,
    UserCheck, BarChart3, ListFilter,
    LogOut, X, Pill, Stethoscope, ClipboardList, Layers, Microscope
} from "lucide-react";
import { can } from "../utils/auth";
// import logo from '../assets/img/logo3.png';
import { useAuthDetails } from "../utils/jwt";


type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {

    const [open, setOpen] = useState(false);
    const location = useLocation(); // hook para pegar a rota atual

    const isActive = (path: string) => location.pathname === path;

    const { nameUser, companyName, initials } = useAuthDetails();
   

    return (
        <>
            {/* Sidebar Overlay (for mobile) */}
            <div id="sidebar-overlay"
                className={`${isOpen ? "" : "active"}`}
                onClick={onClose}
            ></div>

            <div id="sidebar" className={`w-72 bg-white dark:bg-gray-800 shadow-premium border-r border-gray-200 dark:border-gray-700  ${isOpen ? "" : "active"}  `}>

                <div className="flex flex-col h-full">
                    {/* Logo and Close Button Section */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center h-[85px]">
                        <div className="">
                            <Link to="/" className="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width={220} height={70} viewBox="0 0 220 80" role="img" aria-label="Dr. Time brand">
                                    <title>Dr. Time</title>
                                    <g transform="translate(8,8)">
                                        <rect x="0" y="0" width="64" height="64" rx="10" fill="#8b47ff" />
                                        <path d="M10 36 L18 24 L26 40 L34 30 L42 36" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" transform="translate(6,6)"/>
                                        <path d="M22 18 Q28 10 34 18 M22 18 Q28 13 34 18" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"  transform="translate(6,4)"/>
                                    </g>  
                                   
                                    <g transform="translate(86,44)">
                                        <text x="0" y="0" fontFamily="Poppins, Nunito, Arial, sans-serif" fontWeight="600" fontSize="20" fill="currentColor" className="text-neutral-800 dark:text-neutral-50">Dr.Time</text>
                                        <text x="0" y="18" fontFamily="Poppins, Nunito, Arial, sans-serif" fontWeight="400" fontSize="11" fill="currentColor" className="text-neutral-800 dark:text-neutral-50">
                                        Tecnologia que cuida
                                        </text>
                                    </g>
                                    
                                </svg>
                               

                                {/*
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                                    <img src={logo} alt="Dr.Time" className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white">Dr.Time</h1>
                                    <p className="text-sm font-body text-gray-500 dark:text-gray-400">Tecnologia que cuida</p>
                                </div>
                                */}
                            </Link>
                        </div>
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5 dark:text-gray-300" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                        <ul className="space-y-2">
                            <li>
                                {can("painel", "per_view") && 
                                <Link
                                    to="/painel"
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                                        ${isActive("/painel")
                                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-purple-700 dark:text-primary-300 shadow-sm"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span>Painel</span>
                                </Link>}
                            </li>
                            <li>
                                {can("atendimento", "per_view") && 
                                <Link
                                    to="/atendimento"
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                                        ${isActive("/atendimento")
                                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-purple-700 dark:text-primary-300 shadow-sm"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <ClipboardList className="w-5 h-5" />
                                    <span>Atendimento</span>
                                </Link>}
                            </li>
                            <li>
                                {can("agendamento", "per_view") && 
                                <Link
                                    to="/agendamento"
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                                        ${isActive("/agendamento")
                                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-purple-700 dark:text-primary-300 shadow-sm"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Calendar className="w-5 h-5" />
                                    <span>Agendamento</span>
                                </Link>}
                            </li>
                            <li>
                                {can("relatorio", "per_view") && 
                                <Link
                                    to="/relatorio"
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                                        ${isActive("/relatorio")
                                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-purple-700 dark:text-primary-300 shadow-sm"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                        }`}
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    <span>Relatório</span>
                                </Link>}
                            </li>
                            <li>
                                <button
                                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200"
                                    onClick={() => setOpen(!open)}>
                                    <div className="flex items-center space-x-3">
                                        <ListFilter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <span>Cadastros</span>
                                    </div>
                                    {/* Chevron rotaciona quando aberto */}
                                    <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <ul className={`mt-1 space-y-1 ${open ? "block" : "hidden"}`}>
                                    <li>
                                        {can("usuario", "per_view") && 
                                        <Link
                                            to="/usuario"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-3 transition-all
                                                ${isActive("/usuario")
                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            <UserCheck className="w-5 h-5" />
                                            <span>Usuários</span>
                                        </Link>}
                                    </li>
                                    <li>
                                        {can("paciente", "per_view") && 
                                        <Link
                                            to="/paciente"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-3 transition-all
                                                ${isActive("/paciente")
                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            <Users className="w-5 h-5" />
                                            <span>Pacientes</span>
                                        </Link>}
                                    </li>
                                    <li>
                                        {can("medico", "per_view") && 
                                        <Link
                                            to="/medico"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-3 transition-all
                                                ${isActive("/medico")
                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            <Stethoscope className="w-5 h-5" />
                                            <span>Médicos</span>
                                        </Link>}
                                    </li>
                                    <li>
                                        {can("medicamento", "per_view") && 
                                        <Link
                                            to="/medicamento"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-3 transition-all
                                                ${isActive("/medicamento")
                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            <Pill className="w-5 h-5" />
                                            <span>Medicamentos</span>
                                        </Link>}
                                    </li>
                                    <li>
                                        {can("especialidade", "per_view") &&
                                        <Link
                                            to="/especialidade"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-3 transition-all
                                                ${isActive("/especialidade")
                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            <Layers className="w-5 h-5" />
                                            <span>Especialidades</span>
                                        </Link>}
                                    </li>
                                    <li>
                                        {can("exame", "per_view") &&
                                        <Link
                                            to="/exame"
                                            className={`px-4 py-2 rounded-lg flex items-center space-x-3 transition-all
                                                ${isActive("/exame")
                                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                                }`}
                                        >
                                            <Microscope className="w-5 h-5" />
                                            <span>Exames</span>
                                        </Link>}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    {/* User Profile */}
                    <div className="border-t border-gray-200 dark:border-gray-700 h-20 flex items-center p-4">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 w-full">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm"> {initials}</span>
                            </div>
                            <div className="flex-1 w-32">
                                <p className="text-sm font-display font-semibold text-gray-900 dark:text-white truncate  ">{nameUser || 'N/A'}</p>
                                <p className="text-xs font-body text-gray-500 dark:text-gray-400">{companyName || 'N/A'}</p>
                            </div>
                            <Link to="/sair"><LogOut className="w-4 h-4 text-gray-400" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
