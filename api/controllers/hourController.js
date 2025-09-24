import Hour from "../models/hourModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD, normalizarDecimal } from "../utils/utils.js";
import { json } from "express";

const hourController = {

  getAll: (req, res) => {

    const { empresaId } = req.user; // vem do token via middleware   

    Hour.findAll({ empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Hour.findByID({ id, empresaId }, (err, results) => {

      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Registro não encontrado" });
      }

      res.json(results[0]);
    });
  },

  register: (req, res) => {

    // const { name,registro_ans } = req.body; 
    const idDoctor = req.body.idDoctor.replace(/\D/g, '').trim();
    const firstEntry = req.body.firstEntry.trim();
    const firstExit = req.body.firstExit.trim();
    const secondEntry = req.body.secondEntry.trim();
    const secondExit = req.body.secondExit.trim();
         
    const { id: createdByUserId, empresaId } = req.user; // vem do token via middleware     

    if (!idDoctor) {
      return res.status(422).json({
        type: "erro",
        message: "O campo médico é obrigatório",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Hour.checkRegistration({ idDoctor, empresaId }, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length == 0) {
        return res.status(409).json({
          type: "erro",
          message: "Médico não foi encontrado.",
        });
      }

      Hour.checkDuplicity({ idDoctor, empresaId }, (err, result) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length > 0) {
          return res.status(409).json({
            type: "erro",
            message: "Este médico já possui horário cadastrado.",
          });
        }

        const createData = { 
          created_at: timeZoneNow, created_by_user_id: createdByUserId, id_doctor: idDoctor, first_entry: firstEntry, 
          first_exit: firstExit, second_entry: secondEntry, second_exit: secondExit
        };

        // create 
        Hour.create(createData, (err, result) => {
          if (err) return res.status(500).json({ error: err });

            // Registrar log
            Hour.createLog({
              action: 1,                // create
              before: null,
              after: createData,
              table: 'hour',
              created_at: timeZoneNow,
              created_by_user_id: createdByUserId
            }, (err) => {
              if (err) console.error("Erro ao registrar log:", err);
            });

          res.status(201).json({
            message: "Gravado!",
            id: result.insertId,
          });
        });
      });
    });

  },

  update: (req, res) => {
    const id           = req.body.id.replace(/\D/g, '').trim();
    const name         = req.body.name.trim();
    const registroAns = req.body.registroAns.replace(/\D/g, '').trim();
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
        id, name, registro_ans: registroAns, status
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

export default hourController;