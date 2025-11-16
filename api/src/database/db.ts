/*
import mysql from "mysql2/promise";

// Cria pool de conexões
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "vitalis"
 
});

export default pool;
*/

import { Pool } from "pg";

// Cria pool de conexões
const pool = new Pool({
  host: "db",          // nome do serviço no docker-compose
  user: "postgres",    // usuário do banco
  password: "root",    // senha do banco
  database: "vitalis",// nome do banco
  port: 5432           // porta padrão
});

export default pool;
