import db from '../config/db.js';

const Medication = {
  
  findAll: (dados,callback) => {
  
    const { empresaId } = dados;
  
    const sql = `
      SELECT m.* 
      FROM medication m
      INNER JOIN user u ON u.id = m.created_by_user_id 
      WHERE u.company = ?
    `;
  
    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT m.* 
      FROM medication m
      INNER JOIN user u ON u.id = m.created_by_user_id 
      WHERE m.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },
  
  create: (dados, callback) => {
    const { timeZoneNow, createdByUserId, name } = dados;

    const sql = `
      INSERT INTO medication ( name, created_at, created_by_user_id ) 
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [ name, timeZoneNow, createdByUserId],
      callback
    );
  },
 
  checkMedication: (dados, callback) => {

    const { name, empresaId } = dados;

    const sql = `
      SELECT m.id 
      FROM medication m
      INNER JOIN user u ON u.id = m.created_by_user_id 
      WHERE m.name = ? AND u.company = ?
    `;

    db.query(sql, [name, empresaId], callback);
  },

  update: (dados, callback) => {

    const {  id, name, status } = dados;
     
    let sql = `
      UPDATE medication SET name = ?, status = ?
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
    const sql = `DELETE FROM medication WHERE id = ?`;
    db.query(sql, [id], callback);
  },



};

export default Medication;