import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------------------
// Interfaces
// ---------------------------
export interface IPatient {
    id?: number;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    date_of_birth: Date;
    sex: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    health_plan?: string;
    card_number?: string;
    observations?: string;
    created_at?: Date;
    created_by_user_id?: number;
    status: string;
     key?: any;
    
}

export interface ILog {
    action: number;
    before: any;
    after: any;
    table: string;
    created_at: Date;
    created_by_user_id: number;
}

const PatientModel = {
    async create(patient: IPatient): Promise<ResultSetHeader> {
        const {
            name,
            cpf,
            email,
            phone,
            date_of_birth,
            sex,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            health_plan,
            card_number,
            observations,
            created_at,
            created_by_user_id,
            status,
        } = patient;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO patient (name, cpf, email, phone, date_of_birth, sex, cep, street, number, complement,
                neighborhood, city, state, health_plan, card_number, observations, created_at, created_by_user_id, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                cpf,
                email,
                phone,
                date_of_birth,
                sex,
                cep,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                health_plan,
                card_number,
                observations,
                created_at,
                created_by_user_id,
                status,
            ]
        );

        return result;
    },

    async checkCPF(cpfClean: string, empresaId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.id 
            FROM patient p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE p.cpf = ? AND u.company = ?`,
            [cpfClean, empresaId]
        );
        return rows;
    },

    async findAll(empresaId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.* 
            FROM patient p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE u.company = ?`,
            [empresaId]
        );
        return rows;
    },

    async findByID(id: number, empresaId: number) {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT p.* 
            FROM patient p
            INNER JOIN user u ON u.id = p.created_by_user_id 
            WHERE p.id = ? AND u.company = ?`,
            [id, empresaId]
        );
        
        return rows;
    },

    async delete(id: number): Promise<ResultSetHeader> {
        const [result] = await db.query<ResultSetHeader>(
            "DELETE FROM patient WHERE id = ?",
            [id]
        );
        return result;
    },

    async createLog(logData: ILog): Promise<ResultSetHeader> {
        const { action, before, after, table, created_at, created_by_user_id } = logData;

        const [result] = await db.query<ResultSetHeader>(
            `INSERT INTO logs (log_action, log_before, log_after, log_table_name, log_created_at, log_created_by_user_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [action, JSON.stringify(before), JSON.stringify(after), table, created_at, created_by_user_id]
        );

        return result;
    },

    async update(patient: IPatient): Promise<ResultSetHeader> {
        const {
            id,
            name,
            cpf,
            email,
            phone,
            date_of_birth,
            sex,
            cep,
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            health_plan,
            card_number,
            observations,
            status,
        } = patient;

        const [result] = await db.query<ResultSetHeader>(
            `UPDATE patient 
            SET name = ?, cpf = ?, email = ?, phone = ?, date_of_birth = ?, sex = ?, cep = ?, street = ?, number = ?, complement = ?,
                neighborhood = ?, city = ?, state = ?, health_plan = ?, card_number = ?, observations = ?, status = ?
            WHERE id = ?`,
            [
                name,
                cpf,
                email,
                phone,
                date_of_birth,
                sex,
                cep,
                street,
                number,
                complement,
                neighborhood,
                city,
                state,
                health_plan,
                card_number,
                observations,
                status,
                id,
            ]
        );

        return result;
    },
};

export default PatientModel;

