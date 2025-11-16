import pool from "./db";

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Conexão com PostgreSQL OK!");
    const res = await client.query("SELECT NOW() AS now");
    console.log("Data/hora atual do banco:", res.rows[0].now);
    client.release();
  } catch (err) {
    if (err instanceof Error) console.error("Erro ao conectar no PostgreSQL:", err.message);
    else console.error("Erro desconhecido:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
