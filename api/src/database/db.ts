import mysql from "mysql2/promise";

// Cria pool de conexões
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "vitalis"
 
});

export default pool;
