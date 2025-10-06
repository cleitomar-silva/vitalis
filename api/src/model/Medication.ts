
import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------------------
// Interfaces
// ---------------------------

export interface IMedication {
    created_at: Date,
    created_by_user_id: number,
    name: string   
}

export interface IMedicationUp {

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
const Medication = {

    async findAll(companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT m.* 
            FROM medication m
            INNER JOIN user u ON u.id = m.created_by_user_id 
            WHERE u.company = ?`,
            [companyId]
        );
        return rows;
    },

    async findByID(id: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT m.* 
            FROM medication m
            INNER JOIN user u ON u.id = m.created_by_user_id 
            WHERE m.id = ? AND u.company = ?`,
            [id, companyId]
        );
        return rows[0];
    },

    async create(dados: IMedication): Promise<ResultSetHeader> {
        const {
            created_at, created_by_user_id, name
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO medication ( name, created_at, created_by_user_id ) 
            VALUES (?, ?, ?)`,
            [
                name, created_at, created_by_user_id
            ]
        );

        return result;
    },

    async checkMedication(name: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT m.id 
            FROM medication m
            INNER JOIN user u ON u.id = m.created_by_user_id 
            WHERE m.name = ? AND u.company = ?`,
            [name, companyId]
        );
        return rows[0];
    },

    async checkMedicationUp(id: number, name: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT m.id 
            FROM medication m
            INNER JOIN user u ON u.id = m.created_by_user_id 
            WHERE m.name = ? AND u.company = ? AND m.id != ? `,
            [name, companyId, id]
        );
        return rows[0];
    },

    async update(dados: IMedicationUp): Promise<ResultSetHeader> {
        const {
            id, name, status
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE medication SET name = ?, status = ?
            WHERE id = ? `,
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
            "DELETE FROM medication WHERE id = ?",
            [id]
        );
        return result;
    },

}

export default Medication;