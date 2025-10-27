import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  // UserCheck, CalendarX, Moon,
  // Users as UsersIcon,  UserCog, MessageSquare, Stethoscope 
  Plus, Mail, Building, LogIn   
} from "lucide-react";
import { can } from "../utils/auth";
import Preloader from "../components/Preloader";
import Cookies from "js-cookie";
import { apiBaseUrl } from '../config';
import axios, { AxiosError } from 'axios';

function Users() {

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);


  const [loading, setLoading] = useState("");
  const tokenGet = Cookies.get('auth_token_vitalis');
  const [infoUsers, setinfoUsers] = useState<any[]>([]);




  // const search = async (event: React.FormEvent<HTMLFormElement>) => {
  const search = async () => {
    setLoading("visible");

    try {
      const page = Math.min(currentPage + 1, totalPages);

      const result = await axios.get(
        `${apiBaseUrl}/users/search?por_pagina=10&pagina=${page}&search=${searchTerm}`,
        {
          headers: { 'x-access-token': `${tokenGet}` },
        }
      );

      console.log(result.data.lista);

      if (result.data) {
        setinfoUsers(result.data.lista);
      }

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err.response?.data?.message || "Falha ao buscar usuários");
    } finally {
      setLoading("");
    }
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search();
  };

  // opcionais
  const getInitials = (name: string) => {
    if (!name) return "NA";
    const words = name.split(" ");
    const initials = words.map(word => word[0].toUpperCase()).join("");
    return initials.slice(0, 2); // limitar a 2 letras
  };

  const gradientColors = [
    "from-blue-500 to-purple-600",
    "from-pink-500 to-red-600",    
    "from-green-500 to-teal-600",
    "from-indigo-500 to-purple-600",
    "from-yellow-500 to-orange-600",
    "from-cyan-500 to-blue-600",
  ];







  // 🔹 Estado para o filtro selecionado
  const [activeFilter, setActiveFilter] = useState<"todos" | "ativos" | "inativo">("todos");

  // 🔹 Função auxiliar para definir classes de botão
  const getButtonClasses = (type: "todos" | "ativos" | "inativo") => {
    const base =
      "px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer";
    const active =
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
    const inactive =
      "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800";

    return `${base} ${activeFilter === type ? active : inactive}`;
  };

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>();

  // Define o título e subtítulo quando a página é carregada e lista os usuarios
  useEffect(() => {
    setHeaderTitle("Gestão de Usuários");
    setHeaderSubtitle("Gerenciar acessos ao sistema");
    search();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeaderTitle, setHeaderSubtitle]);


  // const canView = can("usuario", "per_view");
  const canCreate = can("usuario", "per_create");

  // if (!canView) {
  //   return (<p className="mt-2 ml-2 mb-2 text-red-700">Você não tem permissão para ver esta página.</p>);
  // }

  return (
    <>
      <Preloader visible={loading} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">


        {/* Department Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">

              {/* TODO - quando clicar em 'Ativos' enviar para o backend o nº 1 e quando clicar em 'Inativo' enviar o nº 2 */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-6">
                <button onClick={() => setActiveFilter("todos")} className={getButtonClasses("todos")}>Todos</button>
                <button onClick={() => setActiveFilter("ativos")} className={getButtonClasses("ativos")}>Ativos</button>
                <button onClick={() => setActiveFilter("inativo")} className={getButtonClasses("inativo")}>Inativo</button>
              </form>
            </div>
            {
              canCreate &&
              <button data-modal-target="addStaffModal" className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 font-body font-medium cursor-pointer">

                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Staff</span>
              </button>
            }
          </div>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Staff Card 1 */}
          {infoUsers.map((user, index) => (                         
            
            <div key={user.id || index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">                  
                  <div className={`  w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}>
  
                    {getInitials(user.name)}
                  </div>
                  <div className="w-40">
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.level_name}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 1
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {user.status_name || "Unknown"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">                  
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">                  
                  <LogIn className="w-4 h-4 mr-2" />
                  <span className="truncate">{user.login}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Building className="w-4 h-4 mr-2" />
                  <span className="truncate">{user.company_name}</span>
                </div>
                                
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">Último login: {user.last_login}</span>
                <div className="flex items-center space-x-2">
                  <button data-modal-target="staffDetailsModal" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm cursor-pointer">Ver</button>
                  <span className="text-gray-600">|</span>
                  <button data-modal-target="staffDetailsModal" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm cursor-pointer">Alterar</button>

                </div>
              </div>
            </div>
          ))}


        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">Showing 1-6 of 47 staff members</p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Previous</button>
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">2</button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">3</button>
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Next</button>
          </div>
        </div>
      </main>

      {/* MODAL 1 */}
      <div id="addStaffModal" className="tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50 hidden flex items-center justify-center z-50">
        <div className="tw-modal-dialog bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white" >Add New Staff</h3>
            <button data-modal-close className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" >
              <i data-lucide="x" className="w-6 h-6 dark:text-gray-300"></i>
            </button>
          </div>

          <form id="addStaffForm" className="space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >First Name *</label>
                  <input type="text" name="firstName" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Last Name *</label>
                  <input type="text" name="lastName" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Date of Birth *</label>
                  <input type="date" name="dateOfBirth" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Gender</label>
                  <select name="gender" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Blood Type</label>
                  <select name="bloodType" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Marital Status</label>
                  <select name="maritalStatus" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4" >Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Phone Number *</label>
                  <input type="tel" name="phone" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Email Address *</label>
                  <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Password *</label>
                  <input type="password" name="password" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" >Confirm Password *</label>
                  <input type="password" name="confirm_password" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700" >
              <button type="button" data-modal-close className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body" >Cancel</button>
              <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors font-body">Add Staff</button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL 2 */}
      <div id="staffDetailsModal" className="tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50 hidden flex items-center justify-center z-50">
        <div className="tw-modal-dialog bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white" >Staff Details</h3>
            <button data-modal-close className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" >
              <i data-lucide="x" className="w-6 h-6 dark:text-gray-300"></i>
            </button>
          </div>
          <div id="staffDetailsContent" className="text-gray-900 dark:text-white">
            {/* Staff Header */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                JD
              </div>
              <div>
                <h4 className="text-xl font-display font-bold" >John Doe</h4>
                <p className="text-gray-600 dark:text-gray-400 font-body" >Staff ID: #12345</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mt-1">
                  Active
                </span>
              </div>
            </div>

            {/* Staff Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 dark:text-white font-display" >Contact Information</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <i data-lucide="phone" className="w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                    <span className="font-body" >+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i data-lucide="mail" className="w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                    <span className="font-body" >john.doe@email.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i data-lucide="calendar" className="w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                    <span className="font-body" >Age: 32</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 dark:text-white font-display" >Recent Activity</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <i data-lucide="clock" className="w-4 h-4 text-gray-500 dark:text-gray-400"></i>
                    <span className="font-body" >Last shift: Jan 12, 2025</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700" >
              <button type="button" data-modal-close className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body" >Close</button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}

export default Users;
