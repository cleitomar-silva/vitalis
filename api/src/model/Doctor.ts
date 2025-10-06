import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------------------
// Interfaces
// ---------------------------
export interface IDoctor {
    created_at: Date,
    user_link_for_login: number,
    name: string,
    cpf: string,
    date_birth: Date,
    specialty: number,
    email: string,
    phone: string,
    professional_advice: string,
    number_advice: number,
    cep: number,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    observations: string,
    created_by_user_id: number,
}

export interface IDoctorUp {
    id: number,
    status: number,
    user_link_for_login: number,
    name: string,
    cpf: string,
    date_birth: Date,
    specialty: number,
    email: string,
    phone: string,
    professional_advice: string,
    number_advice: number,
    cep: number,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    city: string,
    state: string,
    observations: string,
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


const Doctor = {

    async findAll(companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.* 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE u.company = ?`,
            [companyId]
        );
        return rows;
    },

    async findByID(id: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.* 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE d.id = ? AND u.company = ?`,
            [id, companyId]
        );
        return rows[0];
    },

    async checkCPF(cpfClean: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.id 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE d.cpf = ? AND u.company = ?`,
            [cpfClean, companyId]
        );
        return rows[0];
    },

    async checkCPFById(id: number, cpf: string, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.id 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE d.cpf = ? AND u.company = ? AND d.id != ?`,
            [cpf, companyId, id]
        );
        return rows[0];
    },

    async checkLinkUserById(id: number, userLinkForLogin: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.id 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE d.user_link_for_login = ? AND u.company = ? AND d.id != ?`,
            [userLinkForLogin, companyId, id]
        );
        return rows[0];
    },

    async checkLinkUser(userLinkForLogin: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT d.id 
            FROM doctor d
            INNER JOIN user u ON u.id = d.created_by_user_id 
            WHERE d.user_link_for_login = ? AND u.company = ? `,
            [userLinkForLogin, companyId]
        );
        return rows[0];
    },

    async checkLinkUserExists(userLinkForLogin: number, companyId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT u.id 
            FROM user u     
            WHERE u.id = ? AND u.company = ?`,
            [userLinkForLogin, companyId]
        );
        return rows[0];
    },

    async create(doctor: IDoctor): Promise<ResultSetHeader> {
        const {
            created_at, user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice,
            cep, street, number, complement, neighborhood, city, state, observations, created_by_user_id
        } = doctor;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO doctor 
            ( user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep,street,
                number, complement, neighborhood, city, state, observations, created_at, created_by_user_id )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep,
                street, number, complement, neighborhood, city, state, observations, created_at, created_by_user_id
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

    async update(dados: IDoctorUp): Promise<ResultSetHeader> {
        const {
            id, status, user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep, street,
            number, complement, neighborhood, city, state, observations
        } = dados;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE doctor SET status = ?, user_link_for_login = ?, name = ?, cpf = ?, date_birth = ?, specialty = ?, email = ?, phone = ?, 
                professional_advice = ?, number_advice = ?, cep = ?,street = ?, number = ?, complement = ?, neighborhood = ?, city = ?, state = ?, 
                observations = ?
            WHERE id = ? `,
            [
                status, user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep, street,
                number, complement, neighborhood, city, state, observations, id
            ]
        );

        return result;
    },

    async delete(id: number): Promise<ResultSetHeader> {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM doctor WHERE id = ?",
            [id]
        );
        return result;
    },

};

export default Doctor;