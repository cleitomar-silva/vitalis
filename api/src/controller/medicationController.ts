import { Request, Response } from "express";
import { formatDateToYMD, normalizarDecimal } from "../utils/utils";
import Medication, { IMedication, IMedicationUp } from "../model/Medication";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';


const medicationController = {

    // ----------------------------------------------------------------------------
    // Listar todos 
    // ----------------------------------------------------------------------------
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user as any;
            const medication = await Medication.findAll(empresaId);
            res.json(medication);
        } catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // ----------------------------------------------------------------------------
    // Buscar por ID
    // ----------------------------------------------------------------------------
    getById: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { empresaId } = req.user as any;

            const medication = await Medication.findByID(Number(id), empresaId);
            if (!medication) return res.status(404).json({ message: "Registro não encontrado" });

            res.json(medication);
        } catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },


    // ----------------------------------------------------------------------------
    // Registrar 
    // ----------------------------------------------------------------------------
    register: async (req: AuthRequest, res: Response) => {
        try {

            const name = req.body.name.trim() || null;

            const { id: createdByUserId, empresaId } = req.user as any; // token middleware

            if (!name) {
                return res.status(422).json({
                    type: "erro",
                    message: "O campo Nome é obrigatório",
                });
            }
            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const check = await Medication.checkMedication(name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Esse Medicamento já está em uso" });
            }

            const createData: IMedication = {
                created_at: timeZoneNow, created_by_user_id: createdByUserId, name
            };

            const result = await Medication.create(createData);

            await Medication.createLog({
                action: 1,
                before: '',
                after: createData,
                table: 'medication',
                created_at: timeZoneNow,
                created_by_user_id: createdByUserId
            });

            res.status(201).json({ status: "success", message: "cadastrado!", data: { id: result.insertId } });

        } catch (err: any) {
            console.error(err);
            res.status(500).json({ error: err.message || err });
        }

    },


    // ----------------------------------------------------------------------------
    // Atualizar 
    // ----------------------------------------------------------------------------
    update: async (req: AuthRequest, res: Response) => {
        try {

            const id = req.body.id.replace(/\D/g, '') || null;
            const status = req.body.status.replace(/\D/g, '') || null;
            const name = req.body.name.trim() || null;

            const { id: updatedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            if (!name) {
                return res.status(422).json({
                    type: "erro",
                    message: "O campo Nome é obrigatório",
                });
            }

            const findByID = await Medication.findByID(id, empresaId);
            if (!findByID) {
                return res.status(422).json({ status: "error", message: "Registro não encontrado" });
            }

            const check = await Medication.checkMedicationUp(id, name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Já está em uso" });
            }

            const before = findByID;

            const updatedData: IMedicationUp = {
                id, name, status
            };

            const result = await Medication.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<IMedicationUp> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof IMedicationUp];
                const newValue = updatedData[key as keyof IMedicationUp];
                if (String(oldValue) !== String(newValue)) after[key as keyof IMedicationUp] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Medication.createLog({
                    action: 2,
                    before,
                    after,
                    table: "medication",
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


    // ----------------------------------------------------------------------------
    // Deletar medicos
    // ----------------------------------------------------------------------------
    delete: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const { id: deletedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const results = await Medication.findByID(Number(id), empresaId);
            if (!results) return res.status(404).json({ status: "error", message: "Registro não encontrado" });

            const before = results;
            const result = await Medication.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum registro deletado" });

            await Medication.createLog({
                action: 3,
                before,
                after: null,
                table: 'medication',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },


}

export default medicationController;