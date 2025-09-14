import Doctor from "../models/doctorModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD } from "../utils/utils.js";

const doctorController = {

  getAllDoctor: (req, res) => {

    const { id, empresaId } = req.user; // vem do token via middleware  

    Doctor.findAll(empresaId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getDoctorById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Doctor.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Médico não encontrado" });
      }

      res.json(results[0]);
    });
  },

  register: (req, res) => {
    const {
      userLinkForLogin, name, cpf, dateBirth, specialty, email, phone, professionalAdvice, numberAdvice, cep, street,
      number, complement, neighborhood, city, state, observations

    } = req.body;

    const { id: createdByUserId, empresaId } = req.user; // vem do token via middleware 

    let cpfClean = cpf.replace(/\D/g, '');
    let cepClean = cep.replace(/\D/g, '');

    if (!name || !cpfClean) {
      return res.status(422).json({
        type: "erro",
        message: "Os campos Nome e CPF são obrigatórios",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Doctor.checkCPF({ cpfClean, empresaId }, (err, resultCpf) => {
      if (err) return res.status(500).json({ error: err });

      if (resultCpf.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse CPF já está em uso",
        });
      }

      Doctor.checkLinkUser({ userLinkForLogin, empresaId }, (err, resultLink) => {
        if (err) return res.status(500).json({ error: err });

        if (resultLink.length > 0) {
          return res.status(409).json({
            type: "erro",
            message: "Esse Usuário já está em uso em outro cadastro",
          });
        }

        Doctor.checkLinkUserExists({ userLinkForLogin, empresaId }, (err, resultUserExists) => {
          if (err) return res.status(500).json({ error: err });

          if (resultUserExists.length == 0) {
            return res.status(409).json({
              type: "erro",
              message: "Esse usuário não existe",
            });
          }

          const createData = {
            created_at: timeZoneNow, user_link_for_login: userLinkForLogin, name, cpf: cpfClean, date_birth: dateBirth, specialty, email, phone,
            professional_advice: professionalAdvice, number_advice: numberAdvice, cep: cepClean, street, number,
            complement, neighborhood, city, state, observations, created_by_user_id: createdByUserId
          };

          // create 
          Doctor.create(createData, (err, result) => {
            if (err) return res.status(500).json({ error: err });

            // Registrar log
            Doctor.createLog({
              action: 1,                // create
              before: null,
              after: createData,
              table: 'doctor',
              created_at: timeZoneNow,
              created_by_user_id: createdByUserId
            }, (err) => {
              if (err) console.error("Erro ao registrar log:", err);
            });

            res.status(201).json({
              message: "cadastrado!",
              id: result.insertId,
            });
          });


        });



      });
    });


  },

  updateDoctor: (req, res) => {
    const {
      id, status, userLinkForLogin, name, cpf, dateBirth, specialty, email, phone, professionalAdvice, numberAdvice, cep, street,
      number, complement, neighborhood, city, state, observations
    } = req.body;

    const { id: updatedByIdUser, empresaId } = req.user; // vem do token via middleware 

    let cpfClean = cpf.replace(/\D/g, '');
    let cepClean = cep.replace(/\D/g, '');

    if (!name || !cpfClean) {
      return res.status(422).json({
        type: "erro",
        message: "Os campos Nome e CPF são obrigatórios",
      });
    }

    const now = new Date();
    const timeZoneNow = inverterDataHora(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

    Doctor.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) {
        return res.status(404).json({ message: "Médico não encontrado" });
      }

      const before = results[0]; // dados antes da alteração  
      before.date_birth = formatDateToYMD(before.date_birth);

      Doctor.checkCPFById({ id, cpfClean, empresaId }, (err, resultCpf) => {
        if (err) return res.status(500).json({ error: err });

        if (resultCpf.length > 0) {
          return res.status(409).json({
            type: "erro",
            message: "Esse CPF já está em uso",
          });
        }

        Doctor.checkLinkUserById({ id, userLinkForLogin, empresaId }, (err, resultLink) => {
          if (err) return res.status(500).json({ error: err });

          if (resultLink.length > 0) {
            return res.status(409).json({
              type: "erro",
              message: "Esse Usuário já está em uso em outro cadastro",
            });
          }

          Doctor.checkLinkUserExists({ userLinkForLogin, empresaId }, (err, resultUserExists) => {
            if (err) return res.status(500).json({ error: err });

            if (resultUserExists.length == 0) {
              return res.status(409).json({
                type: "erro",
                message: "Esse usuário não existe",
              });
            }

            const updatedData = {
              id, status, user_link_for_login: userLinkForLogin, name, cpf: cpfClean, date_birth: dateBirth, specialty, email, phone,
              professional_advice: professionalAdvice, number_advice: numberAdvice, cep: cepClean, street,
              number, complement, neighborhood, city, state, observations
            };

            // 3️⃣ Atualizar 
            Doctor.update(updatedData, (err, result) => {
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
                Doctor.createLog({
                  action: 2, // update
                  before,
                  after,
                  table: "doctor",
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
    Doctor.findByID({ id, empresaId }, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(404).json({ message: "Médico não encontrado" });

      const before = results[0];


      // 2️⃣ Deletar 
      Doctor.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Nenhum Médico deletado" });

        // 3️⃣ Registrar log
        Doctor.createLog({
          action: 3,                // delete
          before: before,
          after: null,
          table: 'doctor',
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

export default doctorController;
