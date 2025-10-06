import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";


// ---------------------------
// Interfaces
// ---------------------------

export interface IOperator {
    created_at: Date,
    created_by_user_id: number,
    name: string,
    registro_ans: string   
}

export interface IOperatorUp {

    id: number,    
    name: string,
    status: number,
    key?: any,
    registro_ans: string
   
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
const Operator = {

    async findAll(companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT o.* 
            FROM operators o
            INNER JOIN user u ON u.id = o.created_by_user_id 
            WHERE u.company = ?`,
            [companyId]
        );
        return rows;
    },

    async findByID(id: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT o.* 
            FROM operators o
            INNER JOIN user u ON u.id = o.created_by_user_id 
            WHERE o.id = ? AND u.company = ?`,
            [id, companyId]
        );
        return rows[0];
    },

    async check(registroAns: number, name: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT o.id 
            FROM operators o
            INNER JOIN user u ON u.id = o.created_by_user_id 
            WHERE ( o.name = ? || o.registro_ans = ? ) AND u.company = ? `,
            [name, registroAns, companyId]
        );
        return rows[0];
    },

    async checkUp(id: number, registroAns: number, name: string, companyId: number) {
       
        /*
        const query = db.format( `SELECT o.id 
            FROM operators o
            INNER JOIN user u ON u.id = o.created_by_user_id 
            WHERE ( o.name = ? || o.registro_ans = ? ) AND u.company = ? AND u.id != ? `,
            [name, registroAns, companyId,id]);
        console.log("DEBUG SQL:", query);
       */

        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT o.id 
            FROM operators o
            INNER JOIN user u ON u.id = o.created_by_user_id 
            WHERE ( o.name = ? || o.registro_ans = ? ) AND u.company = ? AND o.id != ? `,
            [name, registroAns, companyId, id]
        );
        return rows[0];
    },

    async create(dados: IOperator): Promise<ResultSetHeader> {
        const {
           created_at, created_by_user_id, name, registro_ans
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO operators (name, registro_ans, created_at, created_by_user_id) 
            VALUES (?, ?, ?, ?)`,
            [
                name, registro_ans, created_at, created_by_user_id
            ]
        );

        return result;
    },

    async update(dados: IOperatorUp): Promise<ResultSetHeader> {
        const {
            id, name, registro_ans, status
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE operators SET name = ?, registro_ans = ?, status = ?
            WHERE id = ?`,
            [
                name, registro_ans, status, id 
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
            "DELETE FROM operators WHERE id = ?",
            [id]
        );
        return result;
    },


}

export default Operator;