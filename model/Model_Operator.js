const connection = require("../config/databases");

class Model_Operator {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT * FROM operator 
        ORDER BY id_operator DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async getAvailable() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT * FROM operator 
        WHERE status = 'tersedia'
        ORDER BY id_operator DESC
      `, (err, rows) => {
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
        SELECT * FROM operator 
        WHERE id_operator = ?
      `, [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
    });
  }

  static async store(data) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO operator SET ?', data, (err, result) => {
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
      connection.query('UPDATE operator SET ? WHERE id_operator = ?', [data, id], (err, result) => {
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
      connection.query('DELETE FROM operator WHERE id_operator = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE operator SET ? WHERE id_operator = ?', [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM operator WHERE id_operator = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Model_Operator; 