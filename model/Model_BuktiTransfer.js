const connection = require("../config/databases");

class Model_BuktiTransfer {
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT bt.*, p.id_user 
        FROM bukti_transfer bt
        JOIN pembayaran pb ON bt.id_pembayaran = pb.id_pembayaran
        JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
        ORDER BY bt.id_bukti DESC
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
        SELECT bt.* 
        FROM bukti_transfer bt
        JOIN pembayaran pb ON bt.id_pembayaran = pb.id_pembayaran
        JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
        WHERE p.id_user = ?
        ORDER BY bt.id_bukti DESC
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
        SELECT bt.*, p.id_user 
        FROM bukti_transfer bt
        JOIN pembayaran pb ON bt.id_pembayaran = pb.id_pembayaran
        JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
        WHERE bt.id_bukti = ?
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
      connection.query('INSERT INTO bukti_transfer SET ?', data, (err, result) => {
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
      connection.query('UPDATE bukti_transfer SET ? WHERE id_bukti = ?', [data, id], (err, result) => {
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
      connection.query('DELETE FROM bukti_transfer WHERE id_bukti = ?', [id], (err, result) => {
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
      connection.query('INSERT INTO bukti_transfer SET ?', data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Model_BuktiTransfer; 