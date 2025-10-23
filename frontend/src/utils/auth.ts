// src/utils/auth.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type Permissao = {
  page_name: string;
  per_view: number;
  per_create: number;
  per_edit: number;
  per_delete: number;
};

type TokenPayload = {
  userId: number;
  level: number;
  permissoes: Permissao[];
  exp: number;
};

export function getAuthData(): TokenPayload | null {
  const token = Cookies.get("auth_token_vitalis");
  if (!token) return null;  

  try {
    const decoded = jwtDecode<TokenPayload>(token);  
    
    return decoded;
  } catch {
    return null;
  }
}

export function getPermissoes(): Permissao[] {  

  return getAuthData()?.permissoes || [];
}

export function can(page: string, action: keyof Omit<Permissao, "page_name">): boolean {
  const perm = getPermissoes().find(p => p.page_name === page);

  return perm ? perm[action] === 1 : false;
}
