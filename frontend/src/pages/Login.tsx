import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { apiBaseUrl } from '../config';
import axios, { AxiosError } from 'axios';




function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retorno, setRetorno] = useState('');
  const [loading, setLoading] = useState(false); // Estado para o indicador de carregamento

  const navigate = useNavigate(); // Instanciar o hook useNavigate

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Ativa o indicador de carregamento // TODO
    setRetorno(''); // TODO

    try {
      const response = await axios.post(`${apiBaseUrl}/users/login`, {
        email,
        password,
      });

      console.log(response.data);
      // setRetorno(response.data.message);

      if (response.data.type === 'redefinir') {

        navigate('/redefinir'); // TODO

      } else if (response.data.type === 'sucesso') {

        Cookies.set('auth_token_vitalis', response.data.token, { expires: 1 / 3, secure: true, sameSite: 'Strict' }); // expire em 8h
        Cookies.set('auth_nome_vitalis', response.data.user.nome, { expires: 1 / 3, secure: true, sameSite: 'Strict' }); // expire em 8h
        // Cookies.set('auth_permissoes', response.data.permissoes, { expires: 1/3, secure: true, sameSite: 'Strict' }); // expire em 8h

        navigate('/');
      }

    } catch (error) {

      const err = error as AxiosError<{ message: string }>;
      setRetorno(err.response?.data?.message || "Login falhou");

    } finally {

      setLoading(false); // Desativa o indicador de carregamento 
    }
  };


  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className={"flex items-center justify-center"}>
            <svg xmlns="http://www.w3.org/2000/svg" width={220} height={70} viewBox="0 0 220 80" role="img" aria-label="Risoleta brand">
              <title>Risoleta</title>
              <g transform="translate(8,8)">
                <rect x="0" y="0" width="64" height="64" rx="10" fill="#8b47ff" />
                <path d="M10 36 L18 24 L26 40 L34 30 L42 36" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" transform="translate(6,6)"/>
                <path d="M12 46 Q32 62 52 46" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(6,2)"/>
              </g>
              <g transform="translate(86,44)">
                <text x="0" y="0" fontFamily="Poppins, Nunito, Arial, sans-serif" fontWeight="600" fontSize="20" fill="#2D2D2D">
                  Risoleta
                </text>
                <text x="0" y="18" fontFamily="Poppins, Nunito, Arial, sans-serif" fontWeight="400" fontSize="11" fill="#3E4A61" >
                  Tecnologia que cuida
                </text>
              </g>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or
            <Link to="signup.html" className="font-medium text-padrao-500  ml-2 ">
              crie uma nova conta
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 transition-colors duration-300">
            <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit} >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail
                </label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Senha
                </label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="current-password" required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div className="text-sm">
                  <a href="forgot-password.html" className="font-medium  hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-padrao-500">
                    Esqueci minha senha
                  </a>
                </div>
              </div>

              {retorno &&
                <div
                  className="p-4 text-sm text-red-900 rounded-lg bg-red-100 dark:bg-gray-500 dark:text-red-500"
                  role="alert">
                  <span>{retorno}</span>
                </div>
              }

              <div>
                <button type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-padrao-500 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200 "
                  disabled={loading} // Desabilita o botão enquanto estiver carregando                    
                >
                  {loading ? (
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
