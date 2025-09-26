import db from '../config/db.js';

const hour = {

  findAll: (dados,callback) => {

    const { empresaId } = dados;

    const sql = `
      SELECT h.* 
      FROM hour h
      INNER JOIN user u ON u.id = h.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT h.* 
      FROM hour h
      INNER JOIN user u ON u.id = h.created_by_user_id 
      WHERE h.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  checkDuplicity: (dados, callback) => {

    const { idDoctor, empresaId } = dados;

    const sql = `
      SELECT h.id 
      FROM hour h
      INNER JOIN user u ON u.id = h.created_by_user_id 
      WHERE h.id_doctor = ? AND u.company = ?
    `;

    db.query(sql, [idDoctor, empresaId], callback);
  },

  checkRegistration: (dados, callback) => {

    const { idDoctor, empresaId } = dados;

    const sql = `
      SELECT d.id 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE d.id = ? AND u.company = ?
    `;

    db.query(sql, [idDoctor, empresaId], callback);
  },

  checkRegistrationAndFind: (dados, callback) => {

    const { id, idDoctor, empresaId } = dados;

    const sql = `
      SELECT h.* 
      FROM hour h
      INNER JOIN doctor d ON d.id = h.id_doctor
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE h.id = ? AND d.id = ? AND u.company = ?
    `;

    db.query(sql, [id, idDoctor, empresaId], callback);
  },

  create: (dados, callback) => {
    const {created_at, created_by_user_id, id_doctor, first_entry, first_exit, second_entry, second_exit } = dados;

    const sql = `
      INSERT INTO hour 
        (id_doctor, first_entry, first_exit ,second_entry, second_exit, created_at, created_by_user_id) 
      VALUES ( ?, ?, ?, ?, ?, ?, ? )
    `;

    db.query(
      sql,
      [ id_doctor, first_entry, first_exit, second_entry, second_exit, created_at, created_by_user_id ],
      callback
    );
  },

  update: (dados, callback) => {

    const {  id, id_doctor, first_entry, first_exit, second_entry, second_exit, status } = dados;
     
    let sql = `
      UPDATE hour SET id_doctor = ?, first_entry = ?, first_exit = ?,second_entry = ?, second_exit = ?, status = ?
      WHERE id = ?
    `;
    const params = [ id_doctor, first_entry, first_exit, second_entry, second_exit, status, id ];
    
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
    const sql = `DELETE FROM hour WHERE id = ?`;
    db.query(sql, [id], callback);
  },

}

export default hour;