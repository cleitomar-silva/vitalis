import mysql from "mysql2/promise";

// Cria pool de conexões
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "vitalis",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
