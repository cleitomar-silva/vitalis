
import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------------------
// Interfaces
// ---------------------------

export interface ICreate {
    created_at: Date,
    created_by_user_id: number,   
    id_doctor: number,
    first_entry: string,
    first_exit: string,
    second_entry: string,
    second_exit: string
}

export interface IUpdate {

    id: number,
    status: number,
    key?: any,
    id_doctor: number,
    first_entry: string,
    first_exit: string,
    second_entry: string,
    second_exit: string

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
const Hour = {

    async findAll(companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT h.* 
            FROM hour h
            INNER JOIN user u ON u.id = h.created_by_user_id 
            WHERE u.company = ?`,
            [companyId]
        );
        return rows;
    },

    async findByID(id: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT h.* 
            FROM hour h
            INNER JOIN user u ON u.id = h.created_by_user_id 
            WHERE h.id = ? AND u.company = ?`,
            [id, companyId]
        );
        return rows[0];
    },

    async checkDuplicity(idDoctor: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT h.id 
            FROM hour h
            INNER JOIN user u ON u.id = h.created_by_user_id 
            WHERE h.id_doctor = ? AND u.company = ?`,
            [idDoctor, companyId]
        );
        return rows[0];
    },

    async checkRegistration(idDoctor: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.id 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE d.id = ? AND u.company = ?`,
            [idDoctor, companyId]
        );
        return rows[0];
    },

    async checkDuplicityUp(id: number, idDoctor: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT h.id 
            FROM hour h
            INNER JOIN user u ON u.id = h.created_by_user_id 
            WHERE h.id_doctor = ? AND u.company = ? AND h.id != ?`,
            [idDoctor, companyId, id]
        );
        return rows[0];
    },

    async checkRegistrationAndFind(id: number, idDoctor: number, companyId: number) {
     
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT h.* 
            FROM hour h
            INNER JOIN doctor d ON d.id = h.id_doctor
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE h.id = ? AND d.id = ? AND u.company = ?`,
            [id, idDoctor, companyId]
        );
        return rows[0];
    },

    async create(dados: ICreate): Promise<ResultSetHeader> {
        const {
            created_at, created_by_user_id, id_doctor, first_entry, first_exit, second_entry, second_exit
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO hour 
                (id_doctor, first_entry, first_exit ,second_entry, second_exit, created_at, created_by_user_id) 
            VALUES ( ?, ?, ?, ?, ?, ?, ? )`,
            [
                id_doctor, first_entry, first_exit, second_entry, second_exit, created_at, created_by_user_id
            ]
        );

        return result;
    },

    async update(dados: IUpdate): Promise<ResultSetHeader> {
        const {
            id, id_doctor, first_entry, first_exit, second_entry, second_exit, status
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE hour SET id_doctor = ?, first_entry = ?, first_exit = ?,second_entry = ?, second_exit = ?, status = ?
             WHERE id = ?`,
            [
                id_doctor, first_entry, first_exit, second_entry, second_exit, status, id
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
            "DELETE FROM hour WHERE id = ?",
            [id]
        );
        return result;
    },









}

export default Hour;