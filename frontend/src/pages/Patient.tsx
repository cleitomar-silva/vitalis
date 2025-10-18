import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";


function Patient() {

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
      setHeaderTitle: (title: string) => void;
      setHeaderSubtitle: (subtitle: string) => void;
    }>();
  
    // Define o título e subtítulo quando a página é carregada
    useEffect(() => {
      setHeaderTitle("Pacientes");
      setHeaderSubtitle("Gerenciar Pacientes");
    }, [setHeaderTitle, setHeaderSubtitle]);

  return <h1>Página de Pacientes. patients.html</h1>;
}

export default Patient;