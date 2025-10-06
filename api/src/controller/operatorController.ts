import { Request, Response } from "express";
import Operator, { IOperator, IOperatorUp } from "../model/Operator";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';


const operatorController = {

    // ----------------------------------------------------------------------------
    // Listar todos 
    // ----------------------------------------------------------------------------
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user as any;
            const operator = await Operator.findAll(empresaId);
            res.json(operator);
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

            const operator = await Operator.findByID(Number(id), empresaId);
            if (!operator) return res.status(404).json({ message: "Registro não encontrado" });

            res.json(operator);
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
            const registroAns = req.body.registroAns.replace(/\D/g, '').trim() || null;

            const { id: createdByUserId, empresaId } = req.user as any; // token middleware

            if (!name || !registroAns) {
                return res.status(422).json({
                    type: "erro",
                    message: "Os campos Nome e Registro ANS são obrigatórios",
                });
            }
            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const check = await Operator.check(registroAns, name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Esse registro já está em uso" });
            }

            const createData: IOperator = {
                created_at: timeZoneNow, created_by_user_id: createdByUserId, name, registro_ans: registroAns
            };

            const result = await Operator.create(createData);

            await Operator.createLog({
                action: 1,
                before: '',
                after: createData,
                table: 'operators',
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
            const registroAns = req.body.registroAns.replace(/\D/g, '').trim() || null;

            const { id: updatedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            if (!name) {
                return res.status(422).json({
                    type: "erro",
                    message: "O parâmetro nome é obrigatório",
                });
            }

            const findByID = await Operator.findByID(id, empresaId);
            if (!findByID) {
                return res.status(422).json({ status: "error", message: "Registro não encontrado" });
            }

            const check = await Operator.checkUp(id, registroAns, name, empresaId);
            if (check) {
                return res.status(409).json({ status: "error", message: "Operadora ou registro ans já está em uso" });
            }

            const before = findByID;

            const updatedData: IOperatorUp = {
                id, name, registro_ans: registroAns, status
            };

            const result = await Operator.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<IOperatorUp> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof IOperatorUp];
                const newValue = updatedData[key as keyof IOperatorUp];
                if (String(oldValue) !== String(newValue)) after[key as keyof IOperatorUp] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Operator.createLog({
                    action: 2,
                    before,
                    after,
                    table: "operators",
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

            const results = await Operator.findByID(Number(id), empresaId);
            if (!results) return res.status(404).json({ status: "error", message: "Registro não encontrado" });

            const before = results;
            const result = await Operator.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum registro deletado" });

            await Operator.createLog({
                action: 3,
                before,
                after: null,
                table: 'operators',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },

}

export default operatorController;