const connection = require("../config/databases");

class Model_LogTransaksi {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM log_transaksi ORDER BY id_log DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPemesanan(idPemesanan) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM log_transaksi WHERE id_pemesanan = ? ORDER BY id_log DESC",
        [idPemesanan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO log_transaksi SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM log_transaksi WHERE id_log = ?",
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM log_transaksi WHERE id_log = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_LogTransaksi; 