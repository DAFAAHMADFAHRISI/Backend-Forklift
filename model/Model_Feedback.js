const connection = require("../config/databases");

class Model_Feedback {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT f.*, p.id_user 
        FROM feedback f
        JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
        ORDER BY f.id_feedback DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getByUserId(id_user) {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT f.* 
        FROM feedback f
        JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
        WHERE p.id_user = ?
        ORDER BY f.id_feedback DESC
      `, [id_user], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT f.*, p.id_user 
        FROM feedback f
        JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
        WHERE f.id_feedback = ?
      `, [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
    });
  }

  static async Store(data) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO feedback SET ?', data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async store(data) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO feedback SET ?', data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async Update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE feedback SET ? WHERE id_feedback = ?', [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM feedback WHERE id_feedback = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Model_Feedback; 