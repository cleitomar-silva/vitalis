import db from '../config/db.js';

const Operator = {

  findAll: (dados,callback) => {

    const { empresaId } = dados;

    const sql = `
      SELECT o.* 
      FROM operators o
      INNER JOIN user u ON u.id = o.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT o.* 
      FROM operators o
      INNER JOIN user u ON u.id = o.created_by_user_id 
      WHERE o.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  check: (dados, callback) => {

    const { name, registro_ans, empresaId } = dados;

    const sql = `
      SELECT o.id 
      FROM operators o
      INNER JOIN user u ON u.id = o.created_by_user_id 
      WHERE ( o.name = ? || o.registro_ans = ? ) AND u.company = ?
    `;

    db.query(sql, [name, registro_ans, empresaId], callback);
  },

  create: (dados, callback) => {
    const { created_at, created_by_user_id, name, registro_ans } = dados;

    const sql = `
      INSERT INTO operators (name, registro_ans, created_at, created_by_user_id) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [ name, registro_ans, created_at, created_by_user_id ],
      callback
    );
  },

  update: (dados, callback) => {

    const { id, name, registro_ans, status } = dados;
     
    let sql = `
      UPDATE operators SET name = ?, registro_ans = ?, status = ?
      WHERE id = ?
        `;
    const params = [ name, registro_ans, status, id ];
    
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
    const sql = `DELETE FROM operators WHERE id = ?`;
    db.query(sql, [id], callback);
  },

}

export default Operator;