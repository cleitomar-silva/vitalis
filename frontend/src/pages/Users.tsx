import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus, Mail, Building, LogIn, X, Clock, FileEdit,  UserPlus 
} from "lucide-react";
import { can } from "../utils/auth";
import Preloader from "../components/Preloader";
import Cookies from "js-cookie";
import { apiBaseUrl } from '../config';
import axios, { AxiosError } from 'axios';
import PaginationButtons from "../components/Pagination";
import { useToast } from "../components/ToastContainer";



function Users() {

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0); // novo estado
  const [loading, setLoading] = useState("");
  const tokenGet = Cookies.get('auth_token_vitalis');
  const [infoUsers, setinfoUsers] = useState<any[]>([]);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAlterOpen, setIsAlterOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // TOAST
  const { addToast } = useToast();



  /* --------------------------------------------------------------------------------------
  *
  *  Função para gravar
  *  
  ---------------------------------------------------------------------------------------- */

  const [formCreate, setFormCreate] = useState({ name: "", email: "", level: "", login: "", password: "", passwordConfirm: "" });
 
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    

    setLoading("visible");
    try {
      const response = await axios.post(
        `${apiBaseUrl}/users/register`,
        formCreate,
        {
          headers: { 'x-access-token': `${tokenGet}` },
        }
      );

     
      if (response.data.id) {
        setIsCreateOpen(false);
        // TOAST
        addToast("Usuário cadastrado com sucesso!", "success");
        
        search();
       
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      addToast(err.response?.data?.message || "Erro ao gravar registro", "error");
     
      console.error(err.response?.data?.message || "Falha ao gravar registro");

      

    } finally {
      setLoading("");
    }


  }
 

  /* --------------------------------------------------------------------------------------
  *
  *  Função para buscar os detalhes do usuário 
  *  
  ---------------------------------------------------------------------------------------- */
  const fetchUserDetails = async (userId: number) => {
    setLoading("visible");
    try {
      const response = await axios.get(
        `${apiBaseUrl}/users/${userId}`,
        {
          headers: { 'x-access-token': `${tokenGet}` },
        }
      );

      if (response.data) {
        setSelectedUser(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err.response?.data?.message || "Falha ao buscar detalhes do usuário");
    } finally {
      setLoading("");
    }
  };

  // Função para abrir o modal com os detalhes do usuário
  const handleViewUser = async (userId: number) => {
    await fetchUserDetails(userId);
    setIsViewUserOpen(true);
  };

  /* --------------------------------------------------------------------------------------
  *
  *  Função para Pesquisar & Listar os usuarios 
  *  
  ---------------------------------------------------------------------------------------- */

  const search = async () => {
    setLoading("visible");

    try {

      const page = currentPage + 1; // página real do backend

      let statusValue = "";
      if (activeFilter === "ativos") statusValue = "1";
      else if (activeFilter === "inativo") statusValue = "2";

      const result = await axios.get(
        `${apiBaseUrl}/users/search?por_pagina=9&pagina=${page}&status_value=${statusValue}`,
        {
          headers: { 'x-access-token': `${tokenGet}` },
        }
      );

      // console.log(result.data.lista);      

      if (result.data) {
        setinfoUsers(result.data.lista);
        setTotalPages(result.data.totalPaginas || 1);  // 🔹 atualizar totalPages
        setTotalRecords(result.data.totalRegistros || 0); // 🔹 atualizar totalRecords
      }

    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error(err.response?.data?.message || "Falha ao buscar usuários");
    } finally {
      setLoading("");
    }
  };


  /* ----------------------------------------------------------------------------------------
  *
  * Buscar para Editar 
  * 
  * ---------------------------------------------------------------------------------------*/

  const handleAlter = async (userId: number) => {
    // await fetchUserDetails(userId);
    setIsAlterOpen(true);
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

  }, [setHeaderTitle, setHeaderSubtitle]);

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeFilter]);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);


  // const canView = can("usuario", "per_view");
  const canCreate = can("usuario", "per_create");

  // if (!canView) {
  //   return (<p className="mt-2 ml-2 mb-2 text-red-700">Você não tem permissão para ver esta página.</p>);
  // }

  return (
    <>
      <Preloader visible={loading} />
      {/* TODO verificar toast: criar um novo */}
  

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900">


        {/* Department Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setActiveFilter("todos"); }} className={getButtonClasses("todos")}>Todos</button>
              <button onClick={() => { setActiveFilter("ativos"); }} className={getButtonClasses("ativos")}>Ativos</button>
              <button onClick={() => { setActiveFilter("inativo"); }} className={getButtonClasses("inativo")}>Inativo</button>
            </div>
            {
              canCreate &&
              <button 
                onClick={() => setIsCreateOpen(true)}
                data-modal-target="addStaffModal" className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 font-body font-medium cursor-pointer">

                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo</span>
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
                  className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === "1"
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
                  <button onClick={() => handleViewUser(user.id)} data-modal-target="staffDetailsModal" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm cursor-pointer">Ver</button>
                  <span className="text-gray-600">|</span>
                  <button onClick={()=> handleAlter(user.id)} data-modal-target="staffDetailsModal" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm cursor-pointer">Alterar</button>

                </div>
              </div>
            </div>
          ))}


        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando de {currentPage * 9 + 1} a {Math.min((currentPage + 1) * 9, totalRecords)} de {totalRecords} registros
          </p>
          <PaginationButtons
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

        </div>
      </main>

      {/* MODAL 1 create*/}
      {isCreateOpen && (
        <div id="addStaffModal" className="tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50 flex items-center justify-center z-50">
          <div className="tw-modal-dialog bg-white dark:bg-gray-800 rounded-2xl shadow-premium  w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" >
            {/* header */} 
            <div className="flex items-center justify-between mb-6 p-8 bg-green-500 ">               
              <h3 className="text-2xl font-display font-bold text-white dark:text-white flex items-center gap-2">
                <UserPlus  className="w-6 h-6 dark:text-gray-300" />
                <span>Cadastrar</span>
              </h3>
              <button 
                onClick={() => setIsCreateOpen(false)}
                data-modal-close className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" >               
                <X className="w-6 h-6 dark:text-gray-300" />
              </button>
            </div>

            <form  onSubmit={handleSubmit} id="form-create" className="space-y-8 p-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" >Informações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body"><strong>Nome</strong> <span className="text-red-600">*</span></label>
                    <input onChange={(e) => setFormCreate({ ...formCreate, name: e.target.value })} type="text" name="firstName" maxLength={255} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body"><strong>Email</strong> <span className="text-red-600">*</span></label>
                    <input onChange={(e) => setFormCreate({ ...formCreate, email: e.target.value })} type="email" name="lastName" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>                                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" ><strong>Nivel</strong> <span className="text-red-600">*</span></label>
                    <select  onChange={(e) => setFormCreate({ ...formCreate, level: e.target.value })} name="gender" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" >
                      <option value=""></option>
                      <option value="1">Administrador</option>
                      <option value="2">Recepcionista </option>
                      <option value="3">Médico</option>                     
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body"><strong>Login</strong> <span className="text-red-600">*</span></label>
                    <input onChange={(e) => setFormCreate({ ...formCreate, login: e.target.value })} type="text" name="lastName" maxLength={100} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div> 
                 
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2" >Segurança</h4>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                 
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" ><strong>Senha</strong> <span className="text-red-600">*</span></label>
                    <input onChange={(e) => setFormCreate({ ...formCreate, password: e.target.value })} type="password" name="password" maxLength={20} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" ><strong>Confirmar Senha</strong> <span className="text-red-600">*</span></label>
                    <input onChange={(e) => setFormCreate({ ...formCreate, passwordConfirm: e.target.value })} type="password" name="confirm_password" maxLength={20} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                </div>
              </div>                         
            </form>
            <div className="flex items-center justify-end p-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">              
                <button type="button" data-modal-close className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body cursor-pointer mr-3" onClick={() => setIsCreateOpen(false)} >Fechar</button>
                <button type="submit" className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-500 transition-colors font-body cursor-pointer" form="form-create">Gravar</button>              
            </div>

          </div>
        </div>
      )}
      
      {/* MODAL 2  View */}
      {isViewUserOpen && (
        <div id="staffDetailsModal" className="tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50 flex items-center justify-center z-50">
          <div className="tw-modal-dialog bg-white dark:bg-gray-800 rounded-2xl shadow-premium p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Detalhes do Cadastro</h3>
              <button
                onClick={() => {
                  setIsViewUserOpen(false);
                  setSelectedUser(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 dark:text-gray-300" />
              </button>
            </div>

            { selectedUser ? (
              <div id="staffDetailsContent" className="text-gray-900 dark:text-white">
                {/* Staff Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {getInitials(selectedUser.name)}
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold">{selectedUser.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 font-body">{selectedUser.level_name}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${selectedUser.status === "1"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                      }`}>
                      {selectedUser.status_name}
                    </span>
                  </div>
                </div>

                {/* Staff Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white font-display">Informações</h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <LogIn className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-body">{selectedUser.login}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-body">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-body">{selectedUser.company_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 dark:text-white font-display">Último login:</h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-body">{selectedUser.last_login}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setIsViewUserOpen(false);
                      setSelectedUser(null);
                    }}
                    className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Não foi possível carregar os detalhes do usuário.
              </div>
            )}
          </div>
        </div>
      )}

       {/* MODAL 3 Alter */}
      {isAlterOpen && (
        <div id="addStaffModal" className="tw-modal fixed inset-0 bg-[#000000d1] bg-opacity-50 flex items-center justify-center z-50">
          <div className="tw-modal-dialog bg-white dark:bg-gray-800 rounded-2xl shadow-premium  w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" >
            {/* header */} 
            <div className="flex items-center justify-between mb-6 p-8 bg-yellow-500 ">               
              <h3 className="text-2xl font-display font-bold text-white dark:text-white flex items-center gap-2">
                <FileEdit  className="w-6 h-6 dark:text-gray-300" />
                <span>Alterar</span>
              </h3>
              <button 
                onClick={() => setIsAlterOpen(false)}
                data-modal-close className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" >               
                <X className="w-6 h-6 dark:text-gray-300" />
              </button>
            </div>

            <form  id="form-create" className="space-y-8 p-8">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" >Informações</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body"><strong>Nome</strong> <span className="text-red-600">*</span></label>
                    <input type="text" name="firstName" maxLength={255} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body"><strong>Email</strong> <span className="text-red-600">*</span></label>
                    <input  type="email" name="lastName" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>                                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" ><strong>Nivel</strong> <span className="text-red-600">*</span></label>
                    <select  name="gender" required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" >
                      <option value=""></option>
                      <option value="1">Administrador</option>
                      <option value="2">Recepcionista </option>
                      <option value="3">Médico</option>                     
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body"><strong>Login</strong> <span className="text-red-600">*</span></label>
                    <input  type="text" name="lastName" maxLength={100} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div> 
                 
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2" >Segurança</h4>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                 
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" ><strong>Senha</strong> <span className="text-red-600">*</span></label>
                    <input  type="password" name="password" maxLength={20} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-body" ><strong>Confirmar Senha</strong> <span className="text-red-600">*</span></label>
                    <input  type="password" name="confirm_password" maxLength={20} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none" />
                  </div>
                </div>
              </div>                         
            </form>
            <div className="flex items-center justify-end p-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">              
                <button type="button" data-modal-close className="px-6 py-3 border border-gray-200 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-body cursor-pointer mr-3" onClick={() => setIsAlterOpen(false)} >Fechar</button>
                <button type="submit" className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-green-500 transition-colors font-body cursor-pointer" form="form-create">Gravar</button>              
            </div>

          </div>
        </div>
      )}

    </>
  );
}

export default Users;
