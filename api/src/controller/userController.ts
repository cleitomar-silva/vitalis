import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../utils/secretJWT";
import { inverterDataHora } from "../utils/utils";
import UserModel, { IUser, IUserCreate } from "../model/User";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";


const SALT_ROUNDS = 10;

const userController = {


  // --------------------------
  // Login do usuário
  // --------------------------
  login: async (req: AuthRequest, res: Response) => {       

    try {

      const { email, password } = req.body;       

      if (!email || !password) {
        return res.status(400).json({ error: "Os campos 'email' e 'senha' são obrigatórios." });
      }
      
      const user = await UserModel.findByEmail(email);    

      if (!user) return res.status(404).json({ message: "E-mail ou senha inválida.", type: "outros" }); 
    
      const permissions = await UserModel.findPermissions(user.level);

      // Caso precise redefinir senha
      if (user.password === null && user.status === 1) {
        return res.status(200).json({ id: user.id, login: user.login, message: "Redefinir Senha", type: "redefinir" });
      }    

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) return res.status(401).json({ message: "E-mail ou senha inválida", type: "outros" });
      if (user.status === 0) return res.status(400).json({ message: "Bloqueado", type: "outros" });

      const token = jwt.sign({ userId: user.id, empresaId: user.company, permissoes: permissions }, SECRET, { expiresIn: 28800 });

      await UserModel.updateLastLogin(user.id, new Date());

      res.status(200).json({
        user: { nome: user.name, id: user.id },
        message: "Sucesso",
        type: "sucesso",
        token

      });

    } catch (err: any) {
      res.status(500).json({ error: err.message || err });
    }
  },

    // --------------------------
  // Listar todos os usuários
  // --------------------------
  getAllUsers: async (req: AuthRequest, res: Response) => {
    try {
      const { empresaId } = req.user as any;
      const users = await UserModel.findAll(empresaId);
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message || err });
    }
  },

  // --------------------------
  // Pesquisa e lista
  // --------------------------
  getSearch: async (req: AuthRequest, res: Response) => {
    try {
      // Pegando os parâmetros da URL:
      const { por_pagina, pagina, status_value } = req.query;

      // Convertendo para tipos seguros:
      const porPagina = Number(por_pagina) || 9; // padrão = 9
      const paginaAtual = Number(pagina) || 1;    // padrão = 1
      const statusSearch = String(status_value || "").trim(); // string segura

      const { empresaId } = req.user as any;
     
      const users = await UserModel.search(empresaId,porPagina,paginaAtual,statusSearch);

            
      res.json(users);
       
    } catch (err: any) {
      res.status(500).json({ error: err.message || err });
    }
  },

    // --------------------------
  // Buscar usuário por ID
  // --------------------------
  getUserById: async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { empresaId } = req.user as any;

      const user = await UserModel.findByID(Number(id), empresaId);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message || err });
    }
  },

    // --------------------------
  // Registrar usuário
  // --------------------------
  register: async (req: AuthRequest, res: Response) => {
    try {
      const { name, email, password, level, login } = req.body;
      const { id: idUserCreated, empresaId } = req.user as any; // token middleware

      if (!login || !name || !password || !email || !level || !idUserCreated) {
        return res.status(422).json({ type: "erro", message: "Todos os campos são obrigatórios" });
      }

      const now = inverterDataHora(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // 1️⃣ Verifica duplicidade de login
      const existingLogin = await UserModel.findByLogin(login);
      if (existingLogin) return res.status(409).json({ type: "erro", message: "Esse login já está em uso" });
     
      // 2️⃣ Verifica duplicidade de email
      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) return res.status(409).json({ type: "erro", message: "Esse email já está em uso" });

      
      // 3️⃣ Cria o usuário
      const createData: IUserCreate = {
        name,
        email,
        password: hashedPassword,
        level,
        login,
        company: empresaId,
        created_at: new Date(now),
        created_by_user_id: idUserCreated
      };

      const insertId = await UserModel.create(createData);

      // 4️⃣ Registra log
      await UserModel.createLog({
        action: 1,
        before: null,
        after: createData,
        table: "users",
        created_at: new Date(now),
        created_by_user_id: idUserCreated
      });      

      res.status(201).json({ message: "Usuário criado!", id: insertId });

    
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || err });
    }
  },


    // --------------------------
  // Atualizar usuário
  // --------------------------
  updateUser: async (req: AuthRequest, res: Response) => {
    try {
      const { id: userId, empresaId } = req.user as any;
      const { id, name, login, email, password, level, status } = req.body;

      const now = inverterDataHora(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));

      const before = await UserModel.findByID(Number(id), empresaId);
      if (!before) return res.status(404).json({ message: "Usuário não encontrado" });

      const hashedPassword = password?.trim() ? await bcrypt.hash(password, SALT_ROUNDS) : before.password;

      const loginCheck = await UserModel.checkLoginById(login, Number(id));
      if (loginCheck) return res.status(409).json({ type: "erro", message: "Esse login já está em uso" });

      const emailCheck = await UserModel.findByEmailId(email, Number(id));
      if (emailCheck) return res.status(409).json({ type: "erro", message: "Esse email já está em uso" });

      const updatedData: IUser = { id: Number(id), name, login, email, password: hashedPassword, level, status };

      const result = await UserModel.update(updatedData);
      if (result.rowCount === 0) return res.status(404).json({ message: "Nenhum dado alterado", type: "erro" });

      const after: Partial<IUser> = {};
      Object.keys(updatedData).forEach((key) => {
        if (String(before[key as keyof IUser]) !== String(updatedData[key as keyof IUser])) {
          after[key as keyof IUser] = updatedData[key as keyof IUser];
        }
      });

      if (Object.keys(after).length > 0) {
        await UserModel.createLog({
          action: 2,
          before,
          after,
          table: "users",
          created_at: new Date(now),
          created_by_user_id: userId
        });
      }

      res.status(200).json({ message: "Usuário atualizado com sucesso!", id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || err });
    }
  },

  // --------------------------
  // Deletar usuário
  // --------------------------
  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const { id: userId, empresaId } = req.user as any;
      const { id } = req.params;

      const now = inverterDataHora(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));

      const before = await UserModel.findByID(Number(id), empresaId);
      if (!before) return res.status(404).json({ message: "Usuário não encontrado" });

      const result = await UserModel.delete(Number(id));
      if (result.rowCount === 0) return res.status(404).json({ message: "Nenhum usuário deletado" });

      await UserModel.createLog({
        action: 3,
        before,
        after: null,
        table: "users",
        created_at: new Date(now),
        created_by_user_id: userId
      });

      res.status(200).json({ message: "Usuário deletado com sucesso!", id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || err });
    }
  },

};

export default userController;
