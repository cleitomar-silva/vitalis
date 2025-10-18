import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Report() {

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>();

  // Define o título e subtítulo quando a página é carregada
  useEffect(() => {
    setHeaderTitle("Relatório");
    setHeaderSubtitle("Análises & Indicadores");
  }, [setHeaderTitle, setHeaderSubtitle]);

  return <h1>Página de relatorio. reports.html</h1>;
}

export default Report;