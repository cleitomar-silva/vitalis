import { Request, Response } from "express";
import { formatDateToYMD, normalizarDecimal } from "../utils/utils";
import Specialty, { ISpecialty, ISpecialtyUp } from "../model/Specialty";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';


const specialtyController = {

    // ----------------------------------------------------------------------------
    // Listar todos 
    // ----------------------------------------------------------------------------
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user as any;
            const specialty = await Specialty.findAll(empresaId);
            res.json(specialty);
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

            const specialty = await Specialty.findByID(Number(id), empresaId);
            if (!specialty) return res.status(404).json({ message: "Registro não encontrado" });

            res.json(specialty);
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
            const queryValue = req.body.queryValue.trim() || null;

            const { id: createdByUserId, empresaId } = req.user as any; // token middleware

            if (!name) {
                return res.status(422).json({
                    type: "erro",
                    message: "O campo Nome da especialidade é obrigatório",
                });
            }
            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const check = await Specialty.checkSpecialty(name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Essa especialidade já está em uso" });
            }

            const createData: ISpecialty = {
                created_at: timeZoneNow, created_by_user_id: createdByUserId, name, query_value: normalizarDecimal(queryValue)
            };

            const result = await Specialty.create(createData);

            await Specialty.createLog({
                action: 1,
                before: '',
                after: createData,
                table: 'specialty',
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
            const queryValue = req.body.queryValue.trim() || null;


            const { id: updatedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            if (!name) {
                return res.status(422).json({
                    type: "erro",
                    message: "O campo Nome da especialidade é obrigatório",
                });
            }

            const findByID = await Specialty.findByID(id, empresaId);
            if (!findByID) {
                return res.status(422).json({ status: "error", message: "Registro não encontrado" });
            }

            const check = await Specialty.checkSpecialtyUp(id, name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Essa especialidade já está em uso" });
            }

            const before = findByID;

            const updatedData: ISpecialtyUp = {
                id, name, query_value: normalizarDecimal(queryValue), status
            };

            const result = await Specialty.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<ISpecialtyUp> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof ISpecialtyUp];
                const newValue = updatedData[key as keyof ISpecialtyUp];
                if (String(oldValue) !== String(newValue)) after[key as keyof ISpecialtyUp] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Specialty.createLog({
                    action: 2,
                    before,
                    after,
                    table: "specialty",
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
            const { id: deletedByIdUser, empresaId } = req.user!;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const results = await Specialty.findByID(Number(id), empresaId);
            if (!results) return res.status(404).json({ status: "error", message: "Registro não encontrado" });

            const before = results;
            const result = await Specialty.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum registro deletado" });

            await Specialty.createLog({
                action: 3,
                before,
                after: null,
                table: 'specialty',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },
}

export default specialtyController;

