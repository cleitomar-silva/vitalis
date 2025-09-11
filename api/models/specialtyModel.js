import db from '../config/db.js';

const Specialty = {

  findAll: (dados,callback) => {

    const { empresaId } = dados;

    const sql = `
      SELECT s.* 
      FROM specialty s
      INNER JOIN user u ON u.id = s.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT s.* 
      FROM specialty s
      INNER JOIN user u ON u.id = s.created_by_user_id 
      WHERE s.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  checkSpecialty: (dados, callback) => {

    const { name, empresaId } = dados;

    const sql = `
      SELECT s.id 
      FROM specialty s
      INNER JOIN user u ON u.id = s.created_by_user_id 
      WHERE s.name = ? AND u.company = ?
    `;

    db.query(sql, [name, empresaId], callback);
  },

  create: (dados, callback) => {
    const { timeZoneNow, createdByUserId, name, query_value } = dados;

    const sql = `
      INSERT INTO specialty (name,query_value,created_at,created_by_user_id) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [ name, query_value, timeZoneNow, createdByUserId],
      callback
    );
  },

  update: (dados, callback) => {

    const {  id, name, query_value, status } = dados;
     
    let sql = `
      UPDATE specialty SET name = ?, query_value = ?, status = ?
      WHERE id = ?
        `;
    const params = [ name, query_value, status, id ];
    
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
    const sql = `DELETE FROM specialty WHERE id = ?`;
    db.query(sql, [id], callback);
  },

}

export default Specialty;