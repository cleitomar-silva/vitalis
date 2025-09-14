import Operator from "../models/operatorModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD, normalizarDecimal } from "../utils/utils.js";
import { json } from "express";

const operatorController = {

  getAll: (req, res) => {

    const { empresaId } = req.user; // vem do token via middleware   

    Operator.findAll({ empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Operator.findByID({ id, empresaId }, (err, results) => {

      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Operadora não encontrada" });
      }

      res.json(results[0]);
    });
  },

  register: (req, res) => {

    // const { name,registro_ans } = req.body; 
    const name = req.body.name.trim();
    const registroAns = req.body.registroAns.replace(/\D/g, '').trim();

    const { id: createdByUserId, empresaId } = req.user; // vem do token via middleware     

    if (!name || !registroAns) {
      return res.status(422).json({
        type: "erro",
        message: "Os campos Nome e Registro ANS são obrigatórios",
      });
    }

    // const now = new Date().toISOString();
    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Operator.check({ name, registro_ans: registroAns, empresaId }, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Essa Operadora já está em uso",
        });
      }

      const createData = { created_at: timeZoneNow, created_by_user_id: createdByUserId, name, registro_ans: registroAns};

      // create 
      Operator.create(createData, (err, result) => {
        if (err) return res.status(500).json({ error: err });

         // Registrar log
          Operator.createLog({
            action: 1,                // create
            before: null,
            after: createData,
            table: 'operators',
            created_at: timeZoneNow,
            created_by_user_id: createdByUserId
          }, (err) => {
            if (err) console.error("Erro ao registrar log:", err);
          });

        res.status(201).json({
          message: "Operadora Gravada!",
          id: result.insertId,
        });
      });
    });


  },

  update: (req, res) => {
    const id           = req.body.id.replace(/\D/g, '').trim();
    const name         = req.body.name.trim();
    const registro_ans = req.body.registro_ans.replace(/\D/g, '').trim();
    const status       = req.body.status.replace(/\D/g, '').trim();

    const { id: updatedByIdUser, empresaId } = req.user; // vem do token via middleware 

    if (!name || !id || !status) {
      return res.status(422).json({
        type: "erro",
        message: "Os parametros id, nome e status são obrigatórios",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Operator.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        return res.status(404).json({ message: "Operadora não encontrada" });
      }

      const before = results[0]; // dados antes da alteração      

      const updatedData = {
        id, name, registro_ans, status
      };

      // 3️⃣ Atualizar 
      Operator.update(updatedData, (err, result) => {
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
          Operator.createLog({
            action: 2, // update
            before,
            after,
            table: "operators",
            created_at: timeZoneNow,
            created_by_user_id: updatedByIdUser
          }, (err) => {
            if (err) console.error("Erro ao registrar log:", err);
          });
        }

        res.status(200).json({
          message: "Atualizado com sucesso!",
          id: id,
        });
      });
    });

  },

  delete: (req, res) => {

    const { id } = req.params;             // ID do paciente a ser deletado
    const { id: deletedByIdUser, empresaId } = req.user; // vem do token via middleware 

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    // 1️⃣ Buscar  antes de deletar
    Operator.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: "Operadora não encontrada" });

      const before = results[0];

      // 2️⃣ Deletar 
      Operator.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Nenhuma Operadora deletada" });

        // 3️⃣ Registrar log
        Operator.createLog({
          action: 3,                // delete
          before: before,
          after: null,
          table: 'operators',
          created_at: timeZoneNow,
          created_by_user_id: deletedByIdUser
        }, (err) => {
          if (err) console.error("Erro ao registrar log:", err);
        });

        // 4️⃣ Resposta
        res.status(200).json({ message: "Deletado com sucesso!", id });
      });
    });
  },

}

export default operatorController;