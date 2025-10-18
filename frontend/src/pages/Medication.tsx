import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Medication() {

    const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
      setHeaderTitle: (title: string) => void;
      setHeaderSubtitle: (subtitle: string) => void;
    }>();
  
    // Define o título e subtítulo quando a página é carregada
    useEffect(() => {
      setHeaderTitle("Medicamentos");
      setHeaderSubtitle("Cadastro Medicamentos");
    }, [setHeaderTitle, setHeaderSubtitle]);

  return <h1>Página de medicamentos. patients.html</h1>;
}

export default Medication;