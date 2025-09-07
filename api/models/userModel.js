import db from '../config/db.js';

const User = {
  create: (user, callback) => {
    const { name, email, password, level, login, company, now, idUserCreated } = user;

    let userID = idUserCreated !== undefined && idUserCreated !== null && idUserCreated.toString().trim() !== "" && !isNaN(idUserCreated) ? Number(idUserCreated) : null;

    db.query(
      'INSERT INTO user (name, email, password, level, login, company, created_at, created_by_user_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, level, login, company, now, userID],
      callback
    );
  },
  findByEmail: (email, callback) => {

    //  const sql = 'SELECT * FROM user WHERE email = ?';
    //  const query = db.format(sql, [email]);
    //  console.log("DEBUG SQL:", query);

    db.query('SELECT * FROM user WHERE email = ?', [email], callback);
  }, 
  findByLogin: (dados, callback) => {
    const { login } = dados;
    db.query("SELECT * FROM user WHERE login = ? ", [login], callback);
  },
  findAll: (empresaId, callback) => {

    db.query('SELECT * FROM user WHERE company = ?',[empresaId], callback);
  },
  findByID: (dados, callback) => {
    const { id, empresaId } = dados;
    db.query('SELECT * FROM user WHERE id = ? AND company = ?', [id, empresaId], callback);
  },
  checkLoginById: (dados, callback) => {

    const { login, id, empresaId } = dados;

    // const sql = 'SELECT id FROM user WHERE login = ? AND id != ?';
    // const query = db.format(sql, [login,id]);
    //  console.log("DEBUG SQL:", query);

    db.query("SELECT id FROM user WHERE login = ? AND id != ? AND company = ?", [login, id,empresaId], callback);
  },
  update: (dados, callback) => {

    const { id, name, login, password, level, status } = dados;
     
    let sql = `UPDATE user SET name = ?, login = ?, level = ?, status = ?`;
    const params = [name, login, level, status];

    if (password) 
    {
      sql += `, password = ?`;
      params.push(password);
    }

    sql += ` WHERE id = ?`;
    params.push(id);
    
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
    const sql = `DELETE FROM user WHERE id = ?`;
    db.query(sql, [id], callback);
  },




};

export default User;
