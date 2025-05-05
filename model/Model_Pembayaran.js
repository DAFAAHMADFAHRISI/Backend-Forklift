const connection = require("../config/databases");

class Model_Pembayaran {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT p.*, pm.id_pemesanan FROM pembayaran p JOIN pemesanan pm ON p.id_pemesanan = pm.id_pemesanan ORDER BY p.id_pembayaran DESC",
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
        "SELECT * FROM pembayaran WHERE id_pemesanan = ? ORDER BY id_pembayaran DESC",
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
      connection.query("INSERT INTO pembayaran SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pembayaran WHERE id_pembayaran = ?",
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE pembayaran SET ? WHERE id_pembayaran = ?",
        [Data, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM pembayaran WHERE id_pembayaran = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_Pembayaran; 