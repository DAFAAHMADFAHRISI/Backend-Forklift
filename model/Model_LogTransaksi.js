const connection = require("../config/databases");

class Model_LogTransaksi {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT lt.*, p.id_user 
        FROM log_transaksi lt
        JOIN pemesanan p ON lt.id_pemesanan = p.id_pemesanan
        ORDER BY lt.id_log DESC
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
        SELECT lt.* 
        FROM log_transaksi lt
        JOIN pemesanan p ON lt.id_pemesanan = p.id_pemesanan
        WHERE p.id_user = ?
        ORDER BY lt.id_log DESC
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
        SELECT lt.*, p.id_user 
        FROM log_transaksi lt
        JOIN pemesanan p ON lt.id_pemesanan = p.id_pemesanan
        WHERE lt.id_log = ?
      `, [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0]);
        }
      });
    });
  }

  static async store(logData) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO log_transaksi SET ?', {
        id_pemesanan: logData.id_pemesanan,
        status_transaksi: logData.status_transaksi,
        keterangan: logData.keterangan,
        waktu: logData.waktu
      }, (err, result) => {
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
      connection.query('UPDATE log_transaksi SET ? WHERE id_log = ?', [data, id], (err, result) => {
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
      connection.query('DELETE FROM log_transaksi WHERE id_log = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  
  
}

module.exports = Model_LogTransaksi;