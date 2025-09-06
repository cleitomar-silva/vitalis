import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { json } from "express";

const userController = {
  register: (req, res) => {
    const { idUserCreated, name, email, password, level, login, company } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!login || !name || !password || !email || !level || !company) {
      return res.status(422).json({
        type: "erro",
        message: "Todos os campos são obrigatórios",
      });
    }

    const now = new Date().toISOString();

    const saltRounds = 10;
    const hashedPassword = bcryptjs.hashSync(password, saltRounds);

    // 1️⃣ Verificar duplicidade de login
    User.findByLogin(login, (err, resultLogin) => {
      if (err) return res.status(500).json({ error: err });

      if (resultLogin.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse login já está em uso",
        });
      }

      // 2️⃣ Verificar duplicidade de email
      User.findByEmail(email, (err, resultEmail) => {
        if (err) return res.status(500).json({ error: err });

        if (resultEmail.length > 0) {
          return res.status(409).json({
            type: "erro",
            message: "Esse email já está em uso",
          });
        }

        // 3️⃣ Se passou pelas verificações, cria o usuário      
        User.create({ name, email, password: hashedPassword, level, login, company, now, idUserCreated }, (err, result) => {
          if (err) return res.status(500).json({ error: err });

          res.status(201).json({
            message: "Usuário criado!",
            id: result.insertId,
          });
        });
      });
    });
  },

  getAllUsers: (req, res) => {
    User.findAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getUserById: (req, res) => {
    const { id } = req.params;

    User.findByID(id, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res.json(results[0]); // retorna só o usuário encontrado
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Os campos 'email' e 'senha' são obrigatórios." });
    }

    User.findByEmail(email, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length === 0) {
        return res.status(404).json({ message: "Nome ou senha inválida.", type: "outros" });
      }

      const user = result[0]; // usuário encontrado no banco     

      // 1️⃣ Caso usuário precise redefinir senha
      if (user.password === null && user.status === 1) {
        return res.status(200).json({
          id: user.id,
          login: user.login,
          message: "Redefinir Senha",
          type: "redefinir"
        });
      }

      // 2️⃣ Comparação da senha
      const passwordMatch = bcryptjs.compareSync(password, user.password);

      if (passwordMatch && user.status === 1) {

        // Gera o token JWT
        const token = jwt.sign({ userId: user.id, empresaId: user.company }, SECRET, { expiresIn: 28800 }); // 8 horas 

        return res.status(200).json({
          user: {
            nome: user.nome,
            id: user.id,
          },
          message: "Sucesso",
          type: "sucesso",
          token: token,
          permissoes: "" // você pode preencher aqui depois
        });

      }
      else if (passwordMatch && user.status === 0) {
        return res.status(200).json({ message: "Bloqueado", type: "outros" });
      }

      // 3️⃣ Senha incorreta ou não bate
      return res.status(401).json({ message: "Nome ou senha inválida", type: "outros" });
    });
  },

  updateUser: (req, res) => {
    const { updatedByIdUser, id, name, login, password, level, status } = req.body;
    const now = new Date().toISOString();

    User.checkLoginById({ login, id }, (err, resultLogin) => {
      if (err) return res.status(500).json({ error: err });

      if (resultLogin.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse login já está em uso",
        });
      }

      // 1️⃣ Buscar dados atuais do usuário
      User.findByID(id, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) {
          return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const before = results[0]; // dados antes da alteração

        // 2️⃣ Hash da senha, se fornecida
        const hashedPassword = password && password.trim()
          ? bcryptjs.hashSync(password, 10)
          : before.password; // se não forneceu senha, mantém a antiga

        const updatedData = {
          id,
          name,
          login,
          password: hashedPassword,
          level,
          status
        };

        // 3️⃣ Atualizar usuário
        User.update(updatedData, (err, result) => {
          if (err) return res.status(500).json({ error: err });
          if (result.affectedRows === 0) {
            return res.status(404).json({
              message: "Nenhum dado alterado",
              type: "erro",
            });
          }

          // 4️⃣ Criar log apenas com os campos que foram alterados
          const after = {};
          Object.keys(updatedData).forEach(key => {
            const oldValue = before[key];
            const newValue = updatedData[key];

            // Converte ambos para string para comparar corretamente
            if (String(oldValue) !== String(newValue)) {
              after[key] = newValue;
            }
          });

          if (Object.keys(after).length > 0) {
            User.createLog({
              action: 2, // update
              before,
              after,
              table: "user",
              created_at: now,
              created_by_user_id: updatedByIdUser
            }, (err) => {
              if (err) console.error("Erro ao registrar log:", err);
            });
          }

          res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            id: id,
          });
        });
      });
    });
  },

  deleteUser: (req, res) => {

    // DELETE /users/delete/:id?deletedByIdUser=1

    const { id } = req.params;             // ID do usuário a ser deletado
    const { deletedByIdUser } = req.query; // Usuário que realizou a ação
    const now = new Date().toISOString();

    // 1️⃣ Buscar usuário antes de deletar
    User.findByID(id, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: "Usuário não encontrado" });

      const before = results[0];

      // 2️⃣ Deletar usuário
      User.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Nenhum usuário deletado" });

        // 3️⃣ Registrar log
        User.createLog({
          action: 3,                // delete
          before: before,
          after: null,
          table: 'user',
          created_at: now,
          created_by_user_id: deletedByIdUser
        }, (err) => {
          if (err) console.error("Erro ao registrar log:", err);
        });

        // 4️⃣ Resposta
        res.status(200).json({ message: "Usuário deletado com sucesso!", id });
      });
    });
  }




};

export default userController;
