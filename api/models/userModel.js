import db from '../config/db.js';

const User = {
  create: (user, callback) => {
    const { name, email, password,level, login,company,now, idUserCreated } = user;   

    let userID =  idUserCreated !== undefined && idUserCreated !== null && idUserCreated.toString().trim() !== "" && !isNaN(idUserCreated) ? Number(idUserCreated) : null;
     
    db.query(
      'INSERT INTO user (name, email, password, level, login, company, created_at, created_by_user_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, password,level,login,company,now, userID ],
      callback
    );
  },
  findByEmail: (email, callback) => {

   //  const sql = 'SELECT * FROM user WHERE email = ?';
   //  const query = db.format(sql, [email]);
   //  console.log("DEBUG SQL:", query);
   
    db.query('SELECT * FROM user WHERE email = ?', [email], callback);
  },
  findByLogin: (login, callback) => {
      db.query("SELECT * FROM user WHERE login = ?", [login], callback);
  },
  findAll: (callback) => {
    db.query('SELECT id,login, nome, email FROM user', callback);
  },
  findByID: (id, callback) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], callback);
  }
  
};

export default User;
