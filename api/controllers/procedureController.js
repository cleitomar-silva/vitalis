import Procedure from "../models/procedureModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD } from "../utils/utils.js";

const procedureController = {

  getAll: (req, res) => {

    const { empresaId } = req.user; // vem do token via middleware   

    Procedure.findAll({ empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Procedure.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Procedimento não encontrado" });
      }

      res.json(results[0]); // retorna só o usuário encontrado
    });
  },
  
  register: (req, res) => {
   
    const name = req.body.name.trim();  
    const { id: createdByUserId, empresaId } = req.user; // vem do token via middleware     

    if (!name) {
      return res.status(422).json({
        type: "erro",
        message: "O campo Nome é obrigatório",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Procedure.check({ name, empresaId }, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse Procedimento já está em uso",
        });
      }

      const createData = { created_at: timeZoneNow, created_by_user_id: createdByUserId, name};

      // create 
      Procedure.create(createData, (err, result) => {
        if (err) return res.status(500).json({ error: err });

         // Registrar log
          Procedure.createLog({
            action: 1,                // create
            before: null,
            after: createData,
            table: 'procedure_tbl',
            created_at: timeZoneNow,
            created_by_user_id: createdByUserId
          }, (err) => {
            if (err) console.error("Erro ao registrar log:", err);
          });

        res.status(201).json({
          message: "Procedimento Gravado!",
          id: result.insertId,
        });
      });
    });


  },

  update: (req, res) => {
    const id           = req.body.id.replace(/\D/g, '').trim();
    const name         = req.body.name.trim();   
    const status       = req.body.status.replace(/\D/g, '').trim();

    const { id: updatedByIdUser, empresaId } = req.user; // vem do token via middleware 

    if (!name || !id) {
      return res.status(422).json({
        type: "erro",
        message: "Os parametros id e nome são obrigatórios",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Procedure.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        return res.status(404).json({ message: "Procedimento não encontrado" });
      }

      const before = results[0]; // dados antes da alteração      

      const updatedData = {
        id, name, status
      };

      // Atualizar 
      Procedure.update(updatedData, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Nenhum dado alterado",
            type: "erro",
          });
        }

        // Criar log apenas com os campos que foram alterados
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
          Procedure.createLog({
            action: 2, // update
            before,
            after,
            table: "procedure_tbl",
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
    Procedure.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: "Procedimento não encontrado" });

      const before = results[0];

      // 2️⃣ Deletar 
      Procedure.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Nenhum Procedimento deletado" });

        // 3️⃣ Registrar log
        Procedure.createLog({
          action: 3,                // delete
          before: before,
          after: null,
          table: 'procedure_tbl',
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

};

export default procedureController;