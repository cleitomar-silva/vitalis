import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";

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
};

export default userController;
