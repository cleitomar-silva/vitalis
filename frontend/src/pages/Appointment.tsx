import React, { useEffect} from "react";
import { useOutletContext } from "react-router-dom";

function Appointment() {

   const { setHeaderTitle, setHeaderSubtitle } = useOutletContext<{
      setHeaderTitle: (title: string) => void;
      setHeaderSubtitle: (subtitle: string) => void;
    }>();

      // Define o título e subtítulo quando a página é carregada
      useEffect(() => {
        setHeaderTitle("Agendamento");
        setHeaderSubtitle("Gerenciar Agendamento");
      }, [setHeaderTitle, setHeaderSubtitle]);

  return <h1>Página de agendamento. appointments.html</h1>;
}

export default Appointment;