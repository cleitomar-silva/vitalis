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

  create: (dados, callback) => {
    const { timeZoneNow, user_link_for_login,name,cpfClean,date_birth,specialty,email,phone,professional_advice,number_advice,
      cepClean,street, number,complement,neighborhood,city,state,observations, createdByUserId } = dados;

    const sql = `
      INSERT INTO doctor 
      ( user_link_for_login, name, cpf, date_birth, specialty, email, phone, professional_advice, number_advice, cep,street,
      number, complement, neighborhood, city, state, observations, created_at, created_by_user_id ) 

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_link_for_login, name, cpfClean, date_birth, specialty, email, phone, professional_advice, number_advice,cepClean,
        street,number,complement,neighborhood,city,state,observations, timeZoneNow, createdByUserId
      ],
      callback
    );
  },

}  

export default Doctor;

  
  