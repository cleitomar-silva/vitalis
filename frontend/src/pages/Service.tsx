import React, { useEffect} from "react";
import { useOutletContext } from "react-router-dom";

function Service() {

  const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
    setHeaderTitle: (title: string) => void;
    setHeaderSubtitle: (subtitle: string) => void;
  }>();

  // Define o título e subtítulo quando a página é carregada
  useEffect(() => {
    setHeaderTitle("Atendimento");
    setHeaderSubtitle("Gerenciar Atendimento");
  }, [setHeaderTitle, setHeaderSubtitle]);

  return <h1>Página de Atendimento. billing.html</h1>;
}

export default Service;