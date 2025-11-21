import db from "../database/db";
// import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { QueryResult } from "pg";

// ---------------------------
// Interfaces
// ---------------------------
export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  level: string;
  login: string;
  company?: number;
  status?: number;
  created_at?: Date;
  created_by_user_id?: number;
  last_seen?: Date;
  last_login?: Date;
  key?: any;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  level: string;
  login: string;
  company: number;
  created_at: Date;
  created_by_user_id: number;
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


  async findByEmail(email: string): Promise<IUser | null> {
    const result: QueryResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  },

  async findPermissions(level: string): Promise<any[]> {
    const result: QueryResult = await db.query(
      "SELECT * FROM vw_permissions WHERE level_id = $1",
      [level]
    );
    return result.rows;
  },

  async updateLastLogin(userId: number, lastLogin: Date): Promise<QueryResult> {
    const result: QueryResult = await db.query(
      "UPDATE users SET last_login = $1 WHERE id = $2",
      [lastLogin, userId]
    );
    return result;
  },

  async updateLastSeen(userId: number, lastSeen: Date): Promise<QueryResult> {
    const result: QueryResult = await db.query(
      "UPDATE users SET last_seen = $1 WHERE id = $2",
      [lastSeen, userId]
    );
    return result;
  },

  async findAll(companyId: number): Promise<IUser[]> {
    const query = `SELECT * FROM users WHERE company = $1`;
    const result: QueryResult<IUser> = await db.query(query, [companyId]);
    return result.rows;
  },

  async search(
    companyId: number,
    porPagina: number,
    paginaAtual: number,
    statusSearch: string
  ): Promise<{ lista: any[]; totalPaginas: number; totalRegistros: number }> {

    // ---------------------------
    // Monta WHERE dinâmico
    // ---------------------------
    let where = "";
    const queryParams: (string | number)[] = [companyId];
    let paramIndex = 2; // já usamos $1 u.company

    if (statusSearch.trim()) {
      where = ` AND u.status = $${paramIndex}`;
      queryParams.push(statusSearch.trim());
      paramIndex++;
    }

    // ---------------------------
    // Paginação
    // ---------------------------
    const offset = (paginaAtual - 1) * porPagina;

    // ---------------------------
    // Consulta principal
    // ---------------------------
    const sqlList = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.login,
        u.status,
        TO_CHAR(u.last_login, 'DD/MM/YYYY') AS last_login,
        l.name AS level_name,
        c.name AS company_name,
        s.name AS status_name
      FROM users u
      INNER JOIN level l ON l.id = u.level
      INNER JOIN company c ON c.id = u.company
      INNER JOIN status s ON s.id = u.status
      WHERE u.company = $1
      ${where}
      ORDER BY u.id DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    const listParams = [...queryParams, porPagina, offset];
    const resultList = await db.query(sqlList, listParams);
    const lista = resultList.rows;

    // ---------------------------
    // Consulta total de registros
    // ---------------------------
    const sqlCount = `
      SELECT COUNT(u.id)::int AS total_registros
      FROM users u
      WHERE u.company = $1
      ${where};
    `;

    const resultCount = await db.query(sqlCount, queryParams);
    const totalRegistros = resultCount.rows[0]?.total_registros || 0;
    const totalPaginas = Math.ceil(totalRegistros / porPagina);

    // ---------------------------
    // Retorno
    // ---------------------------
    return { lista, totalPaginas, totalRegistros };
  },

  async findByID(id: number, companyId: number): Promise<IUser | null> {
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.login,
        TO_CHAR(u.last_login, 'DD/MM/YYYY HH24:MI') AS last_login,
        l.name AS level_name, 
        c.name AS company_name, 
        s.name AS status_name
      FROM users u
      INNER JOIN level l ON l.id = u.level
      INNER JOIN company c ON c.id = u.company
       INNER JOIN status s ON s.id = u.status
      
      WHERE u.id = $1 AND u.company = $2;
    `;

    const result = await db.query<IUser>(query, [id, companyId]);
    return result.rows[0] || null;
  },

  async findByLogin(login: string): Promise<IUser | null> {

    const query = `SELECT * FROM users WHERE login = $1`;
    const result = await db.query<IUser>(query, [login]);
    return result.rows[0] || null;

  },

  async findByEmailId(email: string, id: number): Promise<IUser | null> {

    const query = `SELECT * FROM users WHERE email = $1 AND id != $2`;
    const result = await db.query<IUser>(query, [email, id]);
    return result.rows[0] || null;

  },

  async create(user: IUserCreate): Promise<number> {
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

    const query = `
      INSERT INTO users 
      (name, email, password, level, login, company, created_at, created_by_user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const values = [name, email, password, level, login, company, created_at, created_by_user_id];

    const result: QueryResult<{ id: number }> = await db.query(query, values);

    return result.rows[0].id; // retorna o id do usuário inserido
  },

  async createLog(logData: ILog): Promise<number> {
    const { action, before, after, table, created_at, created_by_user_id } = logData;
    const query = `INSERT INTO logs (log_action, log_before, log_after, log_table_name, log_created_at, log_created_by_user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `;

    const values = [action, JSON.stringify(before), JSON.stringify(after), table, created_at, created_by_user_id]

    const result: QueryResult<{ id: number }> = await db.query(query, values);

    return result.rows[0].id; // retorna o id do usuário inserido


  },

  async checkLoginById(login: string, id: number): Promise<IUser | null> {

    const query = `SELECT id FROM users  WHERE login = $1 AND id != $2`;
    const result = await db.query<IUser>(query, [login, id]);
    return result.rows[0] || null;
  },

  async update(user: IUser): Promise<QueryResult> {

    const { id, name, login, email, password, level, status } = user;

    const query = `UPDATE users SET name = $1, login = $2, email = $3, level = $4, status = $5, password = $6 WHERE id = $7`;

    const result: QueryResult = await db.query(query, [name, login, email, level, status, password, id]);

    return result;

  },

  async delete(id: number): Promise<QueryResult> {
    const query = `DELETE FROM users WHERE id = $1`;
    const result = await db.query(query, [id]);
    return result;
  },



};

export default UserModel;
