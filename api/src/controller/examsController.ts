
import { Request, Response } from "express";
import { formatDateToYMD, normalizarDecimal } from "../utils/utils";
import Exams, { ICreate, IUpdate } from "../model/Exams";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';


const examsController = {

    // ----------------------------------------------------------------------------
    // Listar todos 
    // ----------------------------------------------------------------------------
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user as any;
            const exams = await Exams.findAll(empresaId);
            res.json(exams);
        } catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },

    // ----------------------------------------------------------------------------
    // Buscar por ID
    // ----------------------------------------------------------------------------
    getById: async (req: AuthRequest, res: Response) => {
        try {
            // const { id } = req.params;
            const id = Number(req.params.id) || null;
            const { empresaId } = req.user as any;

            const exams = await Exams.findByID(Number(id), empresaId);
            if (!exams) return res.status(404).json({ message: "Registro não encontrado" });

            res.json(exams);
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

            const check = await Exams.check(name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Esse registro já está em uso" });
            }

            const createData: ICreate = {
                created_at: timeZoneNow, created_by_user_id: createdByUserId, name
            };

            const result = await Exams.create(createData);

            await Exams.createLog({
                action: 1,
                before: '',
                after: createData,
                table: 'exams',
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

            const id = Number(req.body.id) || null;
            const status = Number(req.body.status) || null;
            const name = req.body.name.trim() || null;

            const { id: updatedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            if (!name) {
                return res.status(422).json({
                    type: "erro",
                    message: "O parâmetro nome é obrigatório",
                });
            }

            const findByID = await Exams.findByID(Number(id), empresaId);
            if (!findByID) {
                return res.status(422).json({ status: "error", message: "Registro não encontrado" });
            }

            const check = await Exams.checkUp(Number(id), name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Registro já está em uso" });
            }

            const before = findByID;

            const updatedData: IUpdate = {
                id: Number(id), name, status: Number(status)
            };

            const result = await Exams.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<IUpdate> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof IUpdate];
                const newValue = updatedData[key as keyof IUpdate];
                if (String(oldValue) !== String(newValue)) after[key as keyof IUpdate] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Exams.createLog({
                    action: 2,
                    before,
                    after,
                    table: "exams",
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
            //const { id } = req.params;
            const id = Number(req.params.id) || null;
           
            const { id: deletedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const results = await Exams.findByID(Number(id), empresaId);
            if (!results) return res.status(404).json({ status: "error", message: "Registro não encontrado" });

            const before = results;
            const result = await Exams.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum registro deletado" });

            await Exams.createLog({
                action: 3,
                before,
                after: null,
                table: 'exams',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },



}

export default examsController;

