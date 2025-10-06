import { Request, Response } from "express";
import { formatDateToYMD, normalizarDecimal } from "../utils/utils";
import Hour, { ICreate, IUpdate } from "../model/Hour";
import { AuthRequest } from "../middlewares/authMiddlewareTypes";
import { toZonedTime } from 'date-fns-tz';


const hourController = {

    // ----------------------------------------------------------------------------
    // Listar todos 
    // ----------------------------------------------------------------------------
    getAll: async (req: AuthRequest, res: Response) => {
        try {
            const { empresaId } = req.user as any;
            const hour = await Hour.findAll(empresaId);
            res.json(hour);
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

            const hour = await Hour.findByID(Number(id), empresaId);
            if (!hour) return res.status(404).json({ message: "Registro não encontrado" });

            res.json(hour);
        } catch (err: any) {
            res.status(500).json({ error: err.message || err });
        }
    },


    // ----------------------------------------------------------------------------
    // Registrar 
    // ----------------------------------------------------------------------------
    register: async (req: AuthRequest, res: Response) => {
        try {

            const idDoctor = Number(req.body.idDoctor) || null;
            const firstEntry = req.body.firstEntry.trim() || null;
            const firstExit = req.body.firstExit.trim() || null;
            const secondEntry = req.body.secondEntry.trim() || null;
            const secondExit = req.body.secondExit.trim() || null;

            const { id: createdByUserId, empresaId } = req.user as any; // token middleware

            if (!idDoctor) {
                return res.status(422).json({
                    type: "erro",
                    message: "O campo médico é obrigatório",
                });
            }
            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            const checkRegistration = await Hour.checkRegistration(idDoctor, empresaId);
            if (!checkRegistration) {
                return res.status(409).json({ status: "error", message: "Médico não foi encontrado." });
            }

            const checkDuplicity = await Hour.checkDuplicity(idDoctor, empresaId);
            if (checkDuplicity) {
                return res.status(409).json({ status: "error", message: "Este médico já possui horário cadastrado." });
            }

            const createData: ICreate = {
                created_at: timeZoneNow, created_by_user_id: createdByUserId, id_doctor: idDoctor, first_entry: firstEntry,
                first_exit: firstExit, second_entry: secondEntry, second_exit: secondExit
            };

            const result = await Hour.create(createData);

            await Hour.createLog({
                action: 1,
                before: '',
                after: createData,
                table: 'hour',
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

    // TODO
    update: async (req: AuthRequest, res: Response) => {
        try {

            const id = Number(req.body.id) || null;
            const status = Number(req.body.status) || null;
            const idDoctor = Number(req.body.idDoctor) || null;
            const firstEntry = req.body.firstEntry.trim() || null;
            const firstExit = req.body.firstExit.trim() || null;
            const secondEntry = req.body.secondEntry.trim() || null;
            const secondExit = req.body.secondExit.trim() || null;

            const { id: updatedByIdUser, empresaId } = req.user as any;

            const timeZoneNow: Date = toZonedTime(new Date(), 'America/Sao_Paulo');

            if (!idDoctor) {
                return res.status(422).json({
                    type: "erro",
                    message: "O parâmetro médico é obrigatório",
                });
            }

            const findByID = await Hour.checkRegistrationAndFind(Number(id), idDoctor, empresaId);
            if (!findByID) {
                return res.status(422).json({ status: "error", message: "Registro não encontrado" });
            }

            const before = findByID;

            const updatedData: IUpdate = {
                id: Number(id), id_doctor: idDoctor, first_entry: firstEntry, first_exit: firstExit, second_entry: secondEntry, second_exit: secondExit, status: Number(status)

            };

            const result = await Hour.update(updatedData);
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum dado alterado" });

            // Criar log apenas com campos alterados
            const after: Partial<IUpdate> = {};
            Object.keys(updatedData).forEach(key => {
                const oldValue = before[key as keyof IUpdate];
                const newValue = updatedData[key as keyof IUpdate];
                if (String(oldValue) !== String(newValue)) after[key as keyof IUpdate] = newValue;
            });

            if (Object.keys(after).length > 0) {
                await Hour.createLog({
                    action: 2,
                    before,
                    after,
                    table: "hour",
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

            const results = await Hour.findByID(Number(id), empresaId);
            if (!results) return res.status(404).json({ status: "error", message: "Registro não encontrado" });

            const before = results;
            const result = await Hour.delete(Number(id));
            if (result.affectedRows === 0) return res.status(404).json({ status: "error", message: "Nenhum registro deletado" });

            await Hour.createLog({
                action: 3,
                before,
                after: null,
                table: 'hour',
                created_at: timeZoneNow,
                created_by_user_id: deletedByIdUser
            });

            res.json({ status: "success", message: "Deletado com sucesso!", data: { id } });
        } catch (err: any) {
            res.status(500).json({ status: "error", message: err.message || err });
        }
    },



}

export default hourController;

