import db from "../database/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

// ---------------------------
// Interfaces
// ---------------------------
export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  level: string;
  login: string;
  company?: number;
  status?: string;
  created_at?: Date;
  created_by_user_id?: number;
  last_seen?: Date;
  last_login?: Date;
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

const UserModel = {

  async create(user: IUser): Promise<ResultSetHeader> {
    const {
      name,
      email,
      password,
      level,
      login,
      company,
      created_at,
      created_by_user_id,
    } = user;

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO user (name, email, password, level, login, company, created_at, created_by_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password, level, login, company, created_at, created_by_user_id]
    );

    return result;
  },

  async findByEmail(email: string) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE email = ?",
      [email]
    );
    return rows[0];
  },

  async findPermissions(level: number) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM vw_permissions WHERE level_id = ?",
      [level]
    );
    return rows;
  },


  async findByEmailId(email: string, id: number) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE email = ? AND id != ?",
      [email, id]
    );
    return rows[0];
  },

  async findByLogin(login: string) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE login = ?",
      [login]
    );
    return rows[0];
  },

  async findAll(companyId: number) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE company = ?",
      [companyId]
    );
    return rows;
  },

  async findByID(id: number, companyId: number) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE id = ? AND company = ?",
      [id, companyId]
    );
    return rows[0];
  },

  async update(user: IUser) {
    const { id, name, login, email, password, level, status } = user;
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE user SET name = ?, login = ?, email = ?, level = ?, status = ?, password = ? WHERE id = ?`,
      [name, login, email, level, status, password, id]
    );
    return result;
  },

  async delete(id: number) {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM user WHERE id = ?",
      [id]
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

  async updateLastSeen(userId: number, lastSeen: Date) {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE user SET last_seen = ? WHERE id = ?",
      [lastSeen, userId]
    );
    return result;
  },

  async updateLastLogin(userId: number, lastLogin: Date) {
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE user SET last_login = ? WHERE id = ?",
      [lastLogin, userId]
    );
    return result;
  },

  async checkLoginById(login: string, id: number) {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM user WHERE login = ? AND id != ?",
      [login, id]
    );
    return rows[0];
  },

  async searchold(companyId: number, porPagina: number, paginaAtual: number, termoBusca: string) {
  
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user WHERE id = ? AND company = ?",
      [companyId]
    );
    return rows[0];
  },

  async search(
    companyId: number,
    porPagina: number,
    paginaAtual: number,
    termoBusca: string
  ): Promise<{ lista: RowDataPacket[]; totalPaginas: number }> {

    // Monta a condição WHERE
    let where = "";
    const queryParams: (string | number)[] = [companyId];

    if (termoBusca.trim()) {
      where = " AND name LIKE ? ";
      queryParams.push(`%${termoBusca.trim()}%`);
    }

    // Calcula OFFSET
    const offset = (paginaAtual - 1) * porPagina;

    // 1️⃣ Consulta principal: lista de registros
    const sqlList = `
      SELECT 
        u.id, u.name, u.email, u.login, u.status, DATE_FORMAT(u.last_login, '%d/%m/%Y' ) AS last_login,
        l.name AS level_name,
        c.name AS company_name, 
        s.name AS status_name

      FROM user u
      INNER JOIN level l ON l.id = u.level
      INNER JOIN company c ON c.id = u.company
      INNER JOIN status s ON s.id = u.status

      WHERE u.company = ? ${where}
      ORDER BY u.id DESC
      LIMIT ?, ?
    `;

    // adiciona offset e limit aos parâmetros
    const listParams = [...queryParams, offset, porPagina];

    const [lista] = await db.query<RowDataPacket[]>(sqlList, listParams);

    // 2️⃣ Contagem total de registros
    const sqlCount = `
      SELECT COUNT(id) AS total_registros
      FROM user
      WHERE company = ? ${where}
    `;

    const [countRows] = await db.query<RowDataPacket[]>(sqlCount, queryParams);
    const totalRegistros = countRows[0].total_registros as number;

    const totalPaginas = Math.ceil(totalRegistros / porPagina);

    return { lista, totalPaginas };
  }



};

export default UserModel;
