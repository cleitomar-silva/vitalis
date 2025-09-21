import db from '../config/db.js';

const Exams = {

  findAll: (dados,callback) => {

    const { empresaId } = dados;

    const sql = `
      SELECT e.* 
      FROM exams e
      INNER JOIN user u ON u.id = e.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT e.* 
      FROM exams e
      INNER JOIN user u ON u.id = e.created_by_user_id 
      WHERE e.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  check: (dados, callback) => {

    const { name, empresaId } = dados;

    const sql = `
      SELECT e.id 
      FROM exams e
      INNER JOIN user u ON u.id = e.created_by_user_id 
      WHERE e.name = ? AND u.company = ?
    `;

    db.query(sql, [name, empresaId], callback);
  },

  create: (dados, callback) => {
    const { created_at, created_by_user_id, name } = dados;

    const sql = `
      INSERT INTO exams (name, created_at, created_by_user_id) 
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [ name, created_at, created_by_user_id ],
      callback
    );
  },

  checkExamsRepeated: (dados, callback) => {

    const { name, id, empresaId } = dados;

    const sql = `
      SELECT e.* 
      FROM exams e
      INNER JOIN user u ON u.id = e.created_by_user_id 
      WHERE e.name = ? AND u.company = ? AND e.id != ?
    `;
  

    db.query(sql, [name, empresaId, id], callback);
  },

  update: (dados, callback) => {

    const { id, name, status } = dados;
     
    let sql = `
      UPDATE exams SET name = ?, status = ?
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
    const sql = `DELETE FROM exams WHERE id = ?`;
    db.query(sql, [id], callback);
  },

}

export default Exams;