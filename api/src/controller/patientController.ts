import { Request, Response } from "express";
import Patient, { IPatient } from "../model/Patient";
import { inverterDataHora, formatDateToYMD } from "../utils/utils";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';
import { json } from "stream/consumers";


const patientController = {
    // --------------------------
    // Registrar paciente
    // --------------------------
    register: async (req: AuthRequest, res: Response) => {
        try {
            const {
                name, cpf, email, phone, dateOfBirth, sex, cep, street, number, complement,
                neighborhood, city, state, healthPlan, cardNumber, observations, status
            } = req.body;

            const { id: createdByUserId, empresaId } = req.user as any;

            const cpfClean = cpf.replace(/\D/g, '');
            const cepClean = cep.replace(/\D/g, '');
            const numberClean = number.replace(/\D/g, '');

            if (!name || !cpf || !phone) {
                return res.status(422).json({ status: "error", message: "Os campos Nome e CPF são obrigatórios" });
            }

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');


            // Verificar duplicidade de CPF
            const existingCPF = await Patient.checkCPF(cpfClean, empresaId);           
            if (existingCPF.length > 0) {
                return res.status(409).json({ status: "error", message: "Esse CPF já está em uso" });
            }           

            const createData: IPatient = {
                name,
                cpf: cpfClean,
                email,
                phone,
                date_of_birth: dateOfBirth,
                sex,
                cep: cepClean,
                street,
                number: numberClean,
                complement,
                neighborhood,
                city,
                state,
                health_plan: healthPlan,
                card_number: cardNumber,
                observations,
                created_at: timeZoneNow,
                created_by_user_id: createdByUserId,
                status
            };

            const result = await Patient.create(createData);

            // Registrar log
            await Patient.createLog({
                action: 1,
                before: null,
                after: createData,
                table: 'patient',
                created_at: timeZoneNow,
                created_by_user_id: createdByUserId
            });

            res.status(201).json({ status: "success", message: "Paciente criado!", data: { id: result.insertId } });
        } catch (err: any) {
            console.error(err);
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },

    // --------------------------
    // Listar todos os pacientes
    // --------------------------
    getAllPatient: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user!;
            const results = await Patient.findAll(empresaId);
            res.json({ status: "success", message: "Pacientes listados", data: results });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },

    // --------------------------
    // Buscar paciente por ID
    // --------------------------
    getPatientById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { empresaId } = req.user!;
            const results = await Patient.findByID(Number(id), empresaId);

            if (results.length === 0) {
                return res.status(404).json({ status: "error", message: "Paciente não encontrado" });
            }
            
            res.json({ status: "success", message: "Paciente encontrado", data: results });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },

    // --------------------------
    // Deletar paciente
    // --------------------------
    deletePatient: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { id: deletedByIdUser, empresaId } = req.user!;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const results = await Patient.findByID(Number(id), empresaId);
            if (results.length === 0) return res.status(404).json({ status: "error", message: "Paciente não encontrado" });

            const before = results[0];
            const result = await Patient.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum Paciente deletado" });

            await Patient.createLog({
                action: 3,
                before,
                after: null,
                table: 'patient',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Paciente deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },

    // --------------------------
    // Atualizar paciente
    // --------------------------
    updatePatient: async (req: AuthRequest, res: Response) => {
        try {
            const {
                id, name, cpf, email, phone, dateOfBirth, sex, cep, street, number, complement,
                neighborhood, city, state, healthPlan, cardNumber, observations, status
            } = req.body;

            
            const { id: updatedByIdUser, empresaId } = req.user!;
            const cpfClean = cpf.replace(/\D/g, '');
            const cepClean = cep.replace(/\D/g, '');
            const numberClean = number.replace(/\D/g, '');
           
            if (!name || !cpfClean) {
                return res.status(422).json({ status: "error", message: "Os campos Nome e CPF são obrigatórios" });
            }

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');            

            const results = await Patient.findByID(Number(id), empresaId);
            if (results.length === 0) return res.status(404).json({ status: "error", message: "Paciente não encontrado" });

            const before = results[0];
            before.date_of_birth = formatDateToYMD(before.date_of_birth);

            const updatedData: IPatient = {
                id,
                name,
                cpf: cpfClean,
                email,
                phone,
                date_of_birth: dateOfBirth,
                sex,
                cep: cepClean,
                street,
                number: numberClean,
                complement,
                neighborhood,
                city,
                state,
                health_plan: healthPlan,
                card_number: cardNumber,
                observations,
                status
            };

            const result = await Patient.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<IPatient> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof IPatient];
                const newValue = updatedData[key as keyof IPatient];
                if (String(oldValue) !== String(newValue)) after[key as keyof IPatient] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Patient.createLog({
                    action: 2,
                    before,
                    after,
                    table: "patient",
                    created_at: timeZoneNow,
                    created_by_user_id: updatedByIdUser
                });
            }

            res.json({ status: "success", message: "Paciente atualizado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },
};

export default patientController;
