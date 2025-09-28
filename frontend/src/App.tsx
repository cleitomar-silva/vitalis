import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // rotas que NÃO terão Sidebar
  const hiddenSidebarRoutes = ["/login", "/sair"];
  const isHidden = hiddenSidebarRoutes.includes(location.pathname);

  const [headerTitle, setHeaderTitle] = useState(""); // titulo da pagina
  const [headerSubtitle, setHeaderSubtitle] = useState(""); // subtitulo da pagina



  return (
    <>
      {isHidden ? (
        <>
          {/* Botão de alternar tema */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {/* Conteúdo da página */}
          <Outlet />
        </>
      ) : (
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onToggleSidebar={toggleSidebar} title={headerTitle} subtitle={headerSubtitle} />

            {/* content*/}
            <Outlet context={{ setHeaderTitle, setHeaderSubtitle }} />


            <Footer />
          </div>

        </div>
      )}
    </>
  );
}

export default App;
