import Patient from "../models/patientModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD } from "../utils/utils.js";



const patientController = {

  register: (req, res) => {
    const {
      name, cpf, email, phone, dateOfBirth, sex, cep, street, number, complement, neighborhood, city, state,
      healthPlan, cardNumber, observations, status
    } = req.body;

    const { id: createdByUserId, empresaId } = req.user; // vem do token via middleware 

    let cpfClean = cpf.replace(/\D/g, '');
    let cepClean = cep.replace(/\D/g, '');
    let numberClean = number.replace(/\D/g, '');

    if (!name || !cpf || !phone) {
      return res.status(422).json({
        type: "erro",
        message: "Os campos Nome e CPF são obrigatórios",
      });
    }

    // const now = new Date().toISOString();
    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    // return res.json({msg:timeZoneNow  });

    Patient.checkCPF({ cpfClean, empresaId }, (err, resultCpf) => {
      if (err) return res.status(500).json({ error: err });

      if (resultCpf.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse CPF já está em uso",
        });
      }

      const createData = {
        created_at: timeZoneNow, name, cpf: cpfClean, email, phone, date_of_birth: dateOfBirth, sex, cep: cepClean, street, 
        number: numberClean, complement, neighborhood, city, state, health_plan: healthPlan, card_number: cardNumber, 
        observations, created_by_user_id: createdByUserId, status
      };

      // create patient
      Patient.create(createData, (err, result) => {
        if (err) return res.status(500).json({ error: err });

        // Registrar log
        Patient.createLog({
          action: 1,                // create
          before: null,
          after: createData,
          table: 'patient',
          created_at: timeZoneNow,
          created_by_user_id: createdByUserId
        }, (err) => {
          if (err) console.error("Erro ao registrar log:", err);
        });

        res.status(201).json({
          message: "Paciente criado!",
          id: result.insertId,
        });
      });
    });


  },

  getAllPatient: (req, res) => {

    const { empresaId } = req.user; // vem do token via middleware   

    Patient.findAll({ empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getPatientById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Patient.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }

      res.json(results[0]); // retorna só o usuário encontrado
    });
  },

  deletePatient: (req, res) => {

    const { id } = req.params;             // ID do paciente a ser deletado
    const { id: deletedByIdUser, empresaId } = req.user; // vem do token via middleware 

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    // 1️⃣ Buscar  antes de deletar
    Patient.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: "Paciente não encontrado" });

      const before = results[0];

      // 2️⃣ Deletar 
      Patient.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Nenhum Paciente deletado" });

        // 3️⃣ Registrar log
        Patient.createLog({
          action: 3,                // delete
          before: before,
          after: null,
          table: 'patient',
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

  updatePatient: (req, res) => {
    const {
      id, name, cpf, email, phone, dateOfBirth, sex, cep, street, number, complement, neighborhood, city, state,
      healthPlan, cardNumber, observations, status
    } = req.body;

    const { id: updatedByIdUser, empresaId } = req.user; // vem do token via middleware 

    let cpfClean = cpf.replace(/\D/g, '');
    let cepClean = cep.replace(/\D/g, '');
    let numberClean = number.replace(/\D/g, '');

    if (!name || !cpfClean) {
      return res.status(422).json({
        type: "erro",
        message: "Os campos Nome e CPF são obrigatórios",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Patient.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        return res.status(404).json({ message: "Paciente não encontrado" });
      }

      const before = results[0]; // dados antes da alteração      
      before.date_of_birth = formatDateToYMD(before.date_of_birth);

      const updatedData = {
        id, name, cpf: cpfClean, email, phone, date_of_birth: dateOfBirth, sex, cep: cepClean, street, number: numberClean, complement, neighborhood, city, state,
        health_plan: healthPlan, card_number: cardNumber, observations, status
      };

      // 3️⃣ Atualizar 
      Patient.update(updatedData, (err, result) => {
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
          Patient.createLog({
            action: 2, // update
            before,
            after,
            table: "patient",
            created_at: timeZoneNow,
            created_by_user_id: updatedByIdUser
          }, (err) => {
            if (err) console.error("Erro ao registrar log:", err);
          });
        }

        res.status(200).json({
          message: "Paciente atualizado com sucesso!",
          id: id,
        });
      });
    });

  },

};

export default patientController;