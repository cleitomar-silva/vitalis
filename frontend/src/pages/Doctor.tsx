import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Doctor() {

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>();

  // Define o título e subtítulo quando a página é carregada
  useEffect(() => {
    setHeaderTitle("Médicos");
    setHeaderSubtitle("Gerenciar Médicos");
  }, [setHeaderTitle, setHeaderSubtitle]);


  return <h1>Página de médicos. patients.html</h1>;
}

export default Doctor;