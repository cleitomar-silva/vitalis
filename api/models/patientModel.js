import db from '../config/db.js';

const Patient = {

  create: (dados, callback) => {
    const { timeZoneNow,name,cpfClean,email,phone,dateOfBirth,sex,cepClean,street,numberClean,complement,neighborhood,city,state,
        healthPlan,cardNumber,observations,createdByUserId,status  } = dados;

    const sql = `
      INSERT INTO patient (name,cpf,email,phone,date_of_birth,sex,cep,street,number,complement,neighborhood,city,state,
        health_plan,card_number,observations,created_at,created_by_user_id,status ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, cpfClean,email,phone,dateOfBirth,sex,cepClean,street,numberClean,complement,neighborhood,city,state,healthPlan,cardNumber,
        observations,timeZoneNow,createdByUserId,status],
      callback
    );
  },

  checkCPF: (dados, callback) => {

    const { cpfClean, empresaId } = dados;

    const sql = `
      SELECT p.id 
      FROM patient p
      INNER JOIN user u ON u.id = p.created_by_user_id 
      WHERE p.cpf = ? AND u.company = ?
    `;

    db.query(sql, [cpfClean, empresaId], callback);
  },

  findAll: (dados,callback) => {

    const { empresaId } = dados;

    const sql = `
      SELECT p.* 
      FROM patient p
      INNER JOIN user u ON u.id = p.created_by_user_id 
      WHERE u.company = ?
    `;

    db.query(sql, [empresaId], callback);
  },

  findByID: (dados, callback) => {

    const { id, empresaId } = dados;

    const sql = `
      SELECT p.* 
      FROM patient p
      INNER JOIN user u ON u.id = p.created_by_user_id 
      WHERE p.id = ? AND u.company = ?
    `;

    db.query(sql, [id, empresaId], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM patient WHERE id = ?`;
    db.query(sql, [id], callback);
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

  update: (dados, callback) => {

    const { name,cpf,email,phone,date_of_birth,sex,cep,street,number,complement,neighborhood,city,state,
        health_plan,card_number,observations,status,id } = dados;
     
    let sql = `
      UPDATE patient SET name = ?,cpf = ?,email = ?,phone = ?,date_of_birth = ?,sex = ?,cep = ?,street = ?,number = ?,complement = ?,
        neighborhood = ?,city = ?,state = ?, health_plan = ?,card_number = ?,observations = ?,status =?
      WHERE id = ?
        `;
    const params = [name,cpf,email,phone,date_of_birth,sex,cep,street,number,complement,neighborhood,city,state,
        health_plan,card_number,observations,status,id];
    
    // const query = db.format(sql, params);
    // console.log("DEBUG SQL:", query);

    db.query(sql, params, callback);

  },



};

export default Patient;