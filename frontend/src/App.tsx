import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar Overlay (for mobile) */}
      <div id="sidebar-overlay" className=""></div>

      {/*Sidebar*/}
      <Sidebar />
    
       {/* Main Content */} 
        <Outlet />
      
    </div>
  );
}

export default App;
