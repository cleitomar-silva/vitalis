import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Exam() {

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>();

  // Define o título e subtítulo quando a página é carregada
  useEffect(() => {
    setHeaderTitle("Exames");
    setHeaderSubtitle("Cadastro de Exames");
  }, [setHeaderTitle, setHeaderSubtitle]);


  return <h1>Página de Exames. patients.html</h1>;
}

export default Exam;