import db from '../config/db.js';

const Doctor = {

  findAll: (empresaId, callback) => {

    const sql = `
      SELECT d.* 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT d.* 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE d.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  checkCPF: (dados, callback) => {

    const { cpfClean, empresaId } = dados;

    const sql = `
      SELECT d.id 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE d.cpf = ? AND u.company = ?
    `;

    db.query(sql, [cpfClean, empresaId], callback);

  },

  checkCPFById: (dados, callback) => {

    const { id, cpfClean, empresaId } = dados;

    const sql = `
      SELECT d.id 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE d.cpf = ? AND u.company = ? AND d.id != ?
    `;

    db.query(sql, [cpfClean, empresaId, id], callback);

  },

  checkLinkUserById: (dados, callback) => {

    const { id, userLinkForLogin, empresaId } = dados;

    const sql = `
      SELECT d.id 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id 
      WHERE d.user_link_for_login = ? AND u.company = ? AND d.id != ?
    `;

    db.query(sql, [userLinkForLogin, empresaId, id], callback);

  },
  
  checkLinkUser: (dados, callback) => {

    const { userLinkForLogin, empresaId } = dados;

    const sql = `
      SELECT d.id 
      FROM doctor d
      INNER JOIN user u ON u.id = d.created_by_user_id       
      WHERE d.user_link_for_login = ? AND u.company = ?
    `;

    db.query(sql, [userLinkForLogin, empresaId], callback);

  },

  checkLinkUserExists: (dados, callback) => {

    const { userLinkForLogin, empresaId } = dados;

    const sql = `
      SELECT u.id 
      FROM user u     
      WHERE u.id = ? AND u.company = ?
    `;

   //  const query = db.format(sql, [userLinkForLogin, empresaId]);
   //  console.log("DEBUG SQL:", query);

    db.query(sql, [userLinkForLogin, empresaId], callback);

  },



  create: (dados, callback) => {
    const { created_at, user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice,
      cep, street, number, complement, neighborhood, city, state, observations, created_by_user_id } = dados;

    const sql = `
      INSERT INTO doctor 
      ( user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep,street,
      number, complement, neighborhood, city, state, observations, created_at, created_by_user_id ) 

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep,
        street, number, complement, neighborhood, city, state, observations, created_at, created_by_user_id
      ],
      callback
    );
  },

  update: (dados, callback) => {

    const {
      id, status, user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep, street,
      number, complement, neighborhood, city, state, observations
    } = dados;

    let sql = `
      UPDATE doctor SET status = ?, user_link_for_login = ?, name = ?, cpf = ?, date_birth = ?, specialty = ?, email = ?, phone = ?, 
        professional_advice = ?, number_advice = ?, cep = ?,street = ?, number = ?, complement = ?, neighborhood = ?, city = ?, state = ?, 
        observations = ?
      WHERE id = ? `;

    const params = [status, user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep, street,
      number, complement, neighborhood, city, state, observations, id];

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
    const sql = `DELETE FROM doctor WHERE id = ?`;
    db.query(sql, [id], callback);
  },


}

export default Doctor;


