import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";


// ---------------------------
// Interfaces
// ---------------------------

export interface ISpecialty {

    created_at: Date,
    created_by_user_id: number,
    name: string,
    query_value: string
}

export interface ISpecialtyUp {

    id: number,
    name: string,
    query_value: string,
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
const Specialty = {

    async findAll(companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT s.* 
            FROM specialty s
            INNER JOIN user u ON u.id = s.created_by_user_id 
            WHERE u.company = ?`,
            [companyId]
        );
        return rows;
    },

    async findByID(id: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT s.* 
            FROM specialty s
            INNER JOIN user u ON u.id = s.created_by_user_id 
            WHERE s.id = ? AND u.company = ?`,
            [id, companyId]
        );
        return rows[0];
    },

    async checkSpecialty(name: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT s.id 
            FROM specialty s
            INNER JOIN user u ON u.id = s.created_by_user_id 
            WHERE s.name = ? AND u.company = ?`,
            [name, companyId]
        );
        return rows[0];
    },

    async checkSpecialtyUp(id: number, name: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT s.id 
            FROM specialty s
            INNER JOIN user u ON u.id = s.created_by_user_id 
            WHERE s.name = ? AND u.company = ? AND s.id != ? `,
            [name, companyId,id]
        );
        return rows[0];
    },

    async create(specialty: ISpecialty): Promise<ResultSetHeader> {
        const {
            created_at, created_by_user_id, name, query_value
        } = specialty;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO specialty (name,query_value,created_at,created_by_user_id) 
            VALUES (?, ?, ?, ?)`,
            [
                name, query_value, created_at, created_by_user_id
            ]
        );

        return result;
    },

    async update(specialty: ISpecialtyUp): Promise<ResultSetHeader> {
        const {
            id, name, query_value, status
        } = specialty;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE specialty SET name = ?, query_value = ?, status = ?
            WHERE id = ? `,
            [
                name, query_value, status, id
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
            "DELETE FROM specialty WHERE id = ?",
            [id]
        );
        return result;
    },


}

export default Specialty;
