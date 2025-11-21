import { useMemo } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Interface para o token decodificado
interface DecodedToken {
    nameUser?: string;
    companyName?: string;
    userId?: number;
    empresaId?: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
}

// Hook personalizado para autenticação
export const useAuthDetails = () => {
    const token = Cookies.get('auth_token_vitalis');

    const decodedToken = useMemo((): DecodedToken | null => {
        if (!token) return null;
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }, [token]);

    const getInitials = (name?: string): string => {
        if (!name) return "NA";
        const words = name.split(" ").filter(word => word.length > 0);
        if (words.length === 0) return "NA";

        const initials = words.map(word => word[0].toUpperCase()).join("");
        return initials.slice(0, 2); // limitar a 2 letras
    };
    const initials = useMemo(() => {
        return getInitials(decodedToken?.nameUser);
    }, [decodedToken?.nameUser]);


    return {
        token,
        nameUser: decodedToken?.nameUser,
        userId: decodedToken?.userId,
        initials,
        companyName: decodedToken?.companyName,
        empresaId: decodedToken?.empresaId
    };
};