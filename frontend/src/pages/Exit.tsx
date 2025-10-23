import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Exit() {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove o cookie 'auth_token'
        Cookies.remove('auth_token_vitalis');
       // Cookies.remove('auth_nome_vitalis');
       // Cookies.remove('auth_permissoes');

        // Redireciona para a página de login após remover o cookie
        navigate('/login', { replace: true });

        // Opcional: Forçar uma atualização da página após o redirecionamento
        window.location.reload(); // Isso força uma nova recarga da página, garantindo que o cookie foi removido
    }, [navigate]);

    return null; // Não precisa renderizar nada
}

export default Exit;
