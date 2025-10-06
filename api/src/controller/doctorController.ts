import { Request, Response } from "express";
import { formatDateToYMD } from "../utils/utils";
import Doctor, { IDoctor, IDoctorUp } from "../model/Doctor";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';

const doctorController = {

    // --------------------------
    // Listar todos os medicos
    // --------------------------
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user as any;
            const doctors = await Doctor.findAll(empresaId);
            res.json(doctors);
        } catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // --------------------------
    // Buscar medicos por ID
    // --------------------------
    getById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { empresaId } = req.user as any;

            const doctor = await Doctor.findByID(Number(id), empresaId);
            if (!doctor) return res.status(404).json({ message: "Médico não encontrado" });

            res.json(doctor);
        } catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // --------------------------
    // Registrar medicos
    // --------------------------
    register: async (req: AuthRequest, res: Response) => {
        try {

            const userLinkForLogin = req.body.userLinkForLogin.replace(/\D/g, '') || null;
            const name = req.body.name || null;
            const cpf = req.body.cpf.replace(/\D/g, '') || null;
            const dateBirth = req.body.dateBirth || null;
            const specialty = req.body.specialty.replace(/\D/g, '') || null;
            const email = req.body.email || null;
            const phone = req.body.phone || null;
            const professionalAdvice = req.body.professionalAdvice || null;
            const numberAdvice = req.body.numberAdvice || null;
            const cep = req.body.cep.replace(/\D/g, '') || null;
            const street = req.body.street || null;
            const number = req.body.number.replace(/\D/g, '') || null;
            const complement = req.body.complement || null;
            const neighborhood = req.body.neighborhood || null;
            const city = req.body.city || null;
            const state = req.body.state || null;
            const observations = req.body.observations || null;

            const { id: createdByUserId, empresaId } = req.user as any; // token middleware

            if (!name || !cpf) {
                return res.status(422).json({
                    type: "erro",
                    message: "Os campos Nome e CPF são obrigatórios",
                });
            }
            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const checkCPF = await Doctor.checkCPF(cpf, empresaId);
            if (checkCPF) {
                return res.status(409).json({ status: "error", message: "Esse CPF já está em uso" });
            }

            const checkLinkUser = await Doctor.checkLinkUser(userLinkForLogin, empresaId);
            if (checkLinkUser) {
                return res.status(409).json({ status: "error", message: "Esse Usuário já está em uso em outro cadastro" });
            }

            const checkLinkUserExists = await Doctor.checkLinkUserExists(userLinkForLogin, empresaId);
            if (!checkLinkUserExists) {
                return res.status(409).json({ status: "error", message: "Esse usuário não existe" });
            }

            const createData: IDoctor = {
                created_at: timeZoneNow, user_link_for_login: userLinkForLogin, name, cpf, date_birth: dateBirth, specialty, email, phone,
                professional_advice: professionalAdvice, number_advice: numberAdvice, cep, street, number,
                complement, neighborhood, city, state, observations, created_by_user_id: createdByUserId
            };

            const result = await Doctor.create(createData);

            await Doctor.createLog({
                action: 1,
                before: '',
                after: createData,
                table: 'doctor',
                created_at: timeZoneNow,
                created_by_user_id: createdByUserId
            });

            res.status(201).json({ status: "success", message: "cadastrado!", data: { id: result.insertId } });

        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: err.message || err });
        }

    },

    // --------------------------
    // Atualizar medicos
    // --------------------------
    updateDoctor: async (req: AuthRequest, res: Response) => {
        try {

            const id = req.body.id.replace(/\D/g, '') || null;
            const status = req.body.status.replace(/\D/g, '') || null;
            const userLinkForLogin = req.body.userLinkForLogin.replace(/\D/g, '') || null;
            const name = req.body.name || null;
            const cpf = req.body.cpf.replace(/\D/g, '') || null;
            const dateBirth = req.body.dateBirth || null;
            const specialty = req.body.specialty.replace(/\D/g, '') || null;
            const email = req.body.email || null;
            const phone = req.body.phone || null;
            const professionalAdvice = req.body.professionalAdvice || null;
            const numberAdvice = req.body.numberAdvice || null;
            const cep = req.body.cep.replace(/\D/g, '') || null;
            const street = req.body.street || null;
            const number = req.body.number.replace(/\D/g, '') || null;
            const complement = req.body.complement || null;
            const neighborhood = req.body.neighborhood || null;
            const city = req.body.city || null;
            const state = req.body.state || null;
            const observations = req.body.observations || null;

            const { id: updatedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            if (!name || !cpf) {
                return res.status(422).json({
                    type: "erro",
                    message: "Os campos Nome e CPF são obrigatórios",
                });
            }

            const findByID = await Doctor.findByID(id, empresaId);
            if (!findByID) {
                return res.status(422).json({ status: "error", message: "Médico não encontrado" });
            }

            const before = findByID;
            before.date_birth = formatDateToYMD(before.date_birth);

            const checkCPFById = await Doctor.checkCPFById(id, cpf, empresaId);
            if (checkCPFById) {
                return res.status(422).json({ status: "error", message: "Esse CPF já está em uso" });
            }

            const checkLinkUserById = await Doctor.checkLinkUserById(id, userLinkForLogin, empresaId);
            if (checkLinkUserById) {
                return res.status(422).json({ status: "error", message: "Esse Usuário já está em uso em outro cadastro" });
            }

            const checkLinkUserExists = await Doctor.checkLinkUserExists(userLinkForLogin, empresaId);
            if (!checkLinkUserExists) {
                return res.status(422).json({ status: "error", message: "Esse usuário não existe" });
            }

            const updatedData: IDoctorUp = {
                id, status, user_link_for_login: userLinkForLogin, name, cpf, date_birth: dateBirth, specialty, email, phone,
                professional_advice: professionalAdvice, number_advice: numberAdvice, cep, street,
                number, complement, neighborhood, city, state, observations
            };

            const result = await Doctor.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<IDoctorUp> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof IDoctorUp];
                const newValue = updatedData[key as keyof IDoctorUp];
                if (String(oldValue) !== String(newValue)) after[key as keyof IDoctorUp] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Doctor.createLog({
                    action: 2,
                    before,
                    after,
                    table: "doctor",
                    created_at: timeZoneNow,
                    created_by_user_id: updatedByIdUser
                });
            }

            res.json({ status: "success", message: "Atualizado com sucesso!", data: { id } });

        }
        catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // --------------------------
    // Deletar medicos
    // --------------------------
    delete: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { id: deletedByIdUser, empresaId } = req.user!;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const results = await Doctor.findByID(Number(id), empresaId);
            if (!results) return res.status(404).json({ status: "error", message: "Medico não encontrado" });

            const before = results;
            const result = await Doctor.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum Medico deletado" });

            await Doctor.createLog({
                action: 3,
                before,
                after: null,
                table: 'doctor',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },

}

export default doctorController;