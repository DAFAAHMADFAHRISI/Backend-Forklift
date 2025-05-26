const connection = require("../config/databases");

class Model_Pembayaran {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT p.*, ps.id_user 
        FROM pembayaran p
        JOIN pemesanan ps ON p.id_pemesanan = ps.id_pemesanan
        ORDER BY p.id_pembayaran DESC
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
        SELECT p.* 
        FROM pembayaran p
        JOIN pemesanan ps ON p.id_pemesanan = ps.id_pemesanan
        WHERE ps.id_user = ?
        ORDER BY p.id_pembayaran DESC
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
        SELECT p.*, ps.id_user 
        FROM pembayaran p
        JOIN pemesanan ps ON p.id_pemesanan = ps.id_pemesanan
        WHERE p.id_pembayaran = ?
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
      connection.query('INSERT INTO pembayaran SET ?', data, (err, result) => {
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
      connection.query('INSERT INTO pembayaran SET ?', data, (err, result) => {
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
      connection.query('UPDATE pembayaran SET ? WHERE id_pembayaran = ?', [data, id], (err, result) => {
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
      connection.query('DELETE FROM pembayaran WHERE id_pembayaran = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getByOrderId(orderId) {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT p.* 
        FROM pembayaran p
        WHERE p.order_id = ?
      `, [orderId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
    });
  }

  static async updateByOrderId(orderId, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE pembayaran SET ? WHERE order_id = ?', [data, orderId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Model_Pembayaran; 