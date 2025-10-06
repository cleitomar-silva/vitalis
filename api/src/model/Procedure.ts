
import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------------------
// Interfaces
// ---------------------------

export interface ICreate {
    created_at: Date,
    created_by_user_id: number,
    name: string
}

export interface IUpdate {

    id: number,
    name: string,
    status: number,
    key?: any,

}

export interface ILog {
    action: number;
    before: any;
    after: any;
    table: string;
    created_at: Date;
    created_by_user_id: number;
}

// ---------------------------
// Class
// ---------------------------
const Procedure = {

    async findAll(companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.* 
            FROM procedure_tbl p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE u.company = ?`,
            [companyId]
        );
        return rows;
    },

    async findByID(id: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.* 
            FROM procedure_tbl p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE p.id = ? AND u.company = ?`,
            [id, companyId]
        );
        return rows[0];
    },

    async check(name: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.id 
            FROM procedure_tbl p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE p.name = ? AND u.company = ? `,
            [name, companyId]
        );
        return rows[0];
    },

    async checkUp(id: number, name: string, companyId: number) {

        /*
        const query = db.format( `SELECT o.id 
            FROM operators o
            INNER JOIN user u ON u.id = o.created_by_user_id 
            WHERE ( o.name = ? || o.registro_ans = ? ) AND u.company = ? AND u.id != ? `,
            [name, registroAns, companyId,id]);
        console.log("DEBUG SQL:", query);
       */

        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.id 
            FROM procedure_tbl p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE p.name = ? AND u.company = ? AND p.id != ? `,
            [name, companyId, id]
        );
        return rows[0];
    },

    async create(dados: ICreate): Promise<ResultSetHeader> {
        const {
            created_at, created_by_user_id, name
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO procedure_tbl (name, created_at, created_by_user_id) 
            VALUES (?, ?, ?)`,
            [
                name, created_at, created_by_user_id
            ]
        );

        return result;
    },

    async update(dados: IUpdate): Promise<ResultSetHeader> {
        const {
            id, name, status
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE procedure_tbl SET name = ?, status = ?
            WHERE id = ?`,
            [
                name, status, id
            ]
        );

        return result;
    },

    async createLog(logData: ILog) {
        const { action, before, after, table, created_at, created_by_user_id } = logData;
        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO logs (log_action, log_before, log_after, log_table_name, log_created_at, log_created_by_user_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
            [action, JSON.stringify(before), JSON.stringify(after), table, created_at, created_by_user_id]
        );
        return result;
    },

    async delete(id: number): Promise<ResultSetHeader> {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM procedure_tbl WHERE id = ?",
            [id]
        );
        return result;
    },
}

export default Procedure;