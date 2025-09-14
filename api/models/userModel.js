import db from '../config/db.js';

const User = {
  create: (user, callback) => {
    const { name, email, password, level, login, company, timeZoneNow, idUserCreated } = user;

    db.query(
      'INSERT INTO user (name, email, password, level, login, company, created_at, created_by_user_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, level, login, company, timeZoneNow, idUserCreated],
      callback
    );
  },
  findByEmail: (email, callback) => {

    //  const sql = 'SELECT * FROM user WHERE email = ?';
    //  const query = db.format(sql, [email]);
    //  console.log("DEBUG SQL:", query);

    db.query('SELECT * FROM user WHERE email = ?', [email], callback);
  },
  findByEmailId: (dados, callback) => {

    const { email, id } = dados;

    //  const sql = 'SELECT * FROM user WHERE email = ?';
    //  const query = db.format(sql, [email]);
    //  console.log("DEBUG SQL:", query);

    db.query('SELECT * FROM user WHERE email = ? AND id != ?' , [email,id], callback);
  },
  findByLogin: (dados, callback) => {
    const { login } = dados;
    db.query("SELECT * FROM user WHERE login = ? ", [login], callback);
  },
  findAll: (empresaId, callback) => {

    db.query('SELECT * FROM user WHERE company = ?', [empresaId], callback);
  },
  findByID: (dados, callback) => {
    const { id, empresaId } = dados;
    db.query('SELECT * FROM user WHERE id = ? AND company = ?', [id, empresaId], callback);
  },
  checkLoginById: (dados, callback) => {

    const { login, id } = dados;

    // const sql = 'SELECT id FROM user WHERE login = ? AND id != ?';
    // const query = db.format(sql, [login,id]);
    //  console.log("DEBUG SQL:", query);

    db.query("SELECT id FROM user WHERE login = ? AND id != ? ", [login, id], callback);
  },
  update: (dados, callback) => {

    const { id, name, login, email, password, level, status } = dados;

    let sql = `UPDATE user SET name = ?, login = ?, email = ?, level = ?, status = ?, password = ?  WHERE id = ?`;
    const params = [name, login, email, level, status, password, id];

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

  updateLastSeen: (dados, callback) => {
    const { userId, lastSeen } = dados;

    const sql = `UPDATE user SET last_seen = ? WHERE id = ?`;
    db.query(sql, [lastSeen, userId], callback);
  },

  updateLastLogin: (dados, callback) => {
    const { userId, lastLogin } = dados;

    const sql = `UPDATE user SET last_login = ? WHERE id = ?`;

    //  const query = db.format(sql,  [lastLogin, userId]);
    //  console.log("DEBUG SQL:", query);

    db.query(sql, [lastLogin, userId], callback);
  },

};

export default User;
