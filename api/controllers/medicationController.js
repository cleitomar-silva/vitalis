import Medication from "../models/medicationModels.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD } from "../utils/utils.js";

const medicationController = {
  
  getAll: (req, res) => {
  
    const { empresaId } = req.user; // vem do token via middleware   
  
    Medication.findAll({empresaId},(err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Medication.findByID({id,empresaId}, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Medicamento não encontrado" });
      }

      res.json(results[0]); // retorna só o usuário encontrado
    });
  },

  register: (req, res) => {
    const { name } = req.body;
    
    const { id: createdByUserId, empresaId } = req.user; // vem do token via middleware 

    if ( !name ) {
      return res.status(422).json({
        type: "erro",
        message: "O campo Nome é obrigatório",
      });
    }

    // const now = new Date().toISOString();
    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    // return res.json({msg:timeZoneNow  });

    Medication.checkMedication({ name, empresaId }, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse Medicamento já está em uso",
        });
      }
      // create
      Medication.create({
        timeZoneNow, createdByUserId, name
      }, (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.status(201).json({
          message: "Medicamento criado!",
          id: result.insertId,
        });
      });
    });


  }, 

  update: (req, res) => {
    const {
      id, name, status
    } = req.body;

    const { id: updatedByIdUser, empresaId } = req.user; // vem do token via middleware 

    if (!name) {
      return res.status(422).json({
        type: "erro",
        message: "O campo Nome é obrigatório",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Medication.findByID({id,empresaId}, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        return res.status(404).json({ message: "Medicamento não encontrada" });
      }     

      const before = results[0]; // dados antes da alteração      
      
      const updatedData = {
         id, name, status
      };

      // 3️⃣ Atualizar 
      Medication.update(updatedData, (err, result) => {
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
          Medication.createLog({
            action: 2, // update
            before,
            after,
            table: "medication",
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
    Medication.findByID({id,empresaId}, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: "Medicamento não encontrada" });
     
      const before = results[0];

      // 2️⃣ Deletar 
      Medication.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Nenhum Medicamento deletado" });

        // 3️⃣ Registrar log
        Medication.createLog({
          action: 3,                // delete
          before: before,
          after: null,
          table: 'medication',
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

export default medicationController;