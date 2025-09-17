import db from '../config/db.js';

const Procedure = {

  findAll: (dados, callback) => {

    const { empresaId } = dados;

    const sql = `
      SELECT p.* 
      FROM procedure_tbl p
      INNER JOIN user u ON u.id = p.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT p.* 
      FROM procedure_tbl p
      INNER JOIN user u ON u.id = p.created_by_user_id 
      WHERE p.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  check: (dados, callback) => {

    const { name, empresaId } = dados;

    const sql = `
      SELECT p.id 
      FROM procedure_tbl p
      INNER JOIN user u ON u.id = p.created_by_user_id 
      WHERE p.name = ? AND u.company = ?
    `;

    db.query(sql, [name, empresaId], callback);
  },

  create: (dados, callback) => {
    const { created_at, created_by_user_id, name } = dados;

    const sql = `
      INSERT INTO procedure_tbl (name, created_at, created_by_user_id) 
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [ name, created_at, created_by_user_id ],
      callback
    );
  },

  update: (dados, callback) => {

    const { id, name, status } = dados;
     
    let sql = `
      UPDATE procedure_tbl SET name = ?, status = ?
      WHERE id = ?
    `;
    const params = [ name, status, id ];
    
    // const query = db.format(sql, params);
    // console.log("DEBUG SQL:", query);

    db.query(sql, params, callback);

  },

  createLog: (logData, callback) => {
    const { action, before, after, table, created_at, created_by_user_id } = logData;

    const sql = `
      INSERT INTO logs (log_action, log_before, log_after, log_table_name, log_created_at, log_created_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;      

    db.query(
      sql,
      [action, JSON.stringify(before), JSON.stringify(after), table, created_at, created_by_user_id],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM procedure_tbl WHERE id = ?`;
    db.query(sql, [id], callback);
  },
};

export default Procedure;