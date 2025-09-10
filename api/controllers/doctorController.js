import Doctor from "../models/doctorModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET } from "../secretJWT.js";
import { inverterDataHora, formatDateToYMD } from "../utils/utils.js";


const doctorController = {


  getAllDoctor: (req, res) => {

    const { id, empresaId } = req.user; // vem do token via middleware  

    Doctor.findAll( empresaId, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getDoctorById: (req, res) => {
    const { id } = req.params;
    const { empresaId } = req.user; // vem do token via middleware 

    Doctor.findByID({id,empresaId}, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(404).json({ message: "Médico não encontrado" });
      }

      res.json(results[0]); 
    });
  },

  register: (req, res) => {
    const {
      user_link_for_login,name,cpf,date_birth,specialty,email,phone,professional_advice,number_advice,cep,street,
      number,complement,neighborhood,city,state,observations

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
   
    Doctor.checkCPF({cpfClean,empresaId}, (err, resultCpf) => {
      if (err) return res.status(500).json({ error: err });

      if (resultCpf.length > 0) {
        return res.status(409).json({
          type: "erro",
          message: "Esse CPF já está em uso",
        });
      }
      // create 
      Doctor.create({
        timeZoneNow, user_link_for_login,name,cpfClean,date_birth,specialty,email,phone,professional_advice,number_advice,cepClean,street,
        number,complement,neighborhood,city,state,observations,createdByUserId
      }, (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.status(201).json({
          message: "cadastrado!",
          id: result.insertId,
        });
      });
    });


  },


}

export default doctorController;
