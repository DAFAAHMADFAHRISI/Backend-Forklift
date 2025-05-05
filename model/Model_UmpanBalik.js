const connection = require("../config/databases");

class Model_UmpanBalik {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT ub.*, p.id_pelanggan, pl.nama 
        FROM umpan_balik ub 
        JOIN pesanan p ON ub.id_pesanan = p.id_pesanan
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan 
        ORDER BY ub.id_umpan_balik DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPesanan(idPesanan) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM umpan_balik WHERE id_pesanan = ?",
        [idPesanan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPelanggan(idPelanggan) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT ub.* FROM umpan_balik ub 
        JOIN pesanan p ON ub.id_pesanan = p.id_pesanan 
        WHERE p.id_pelanggan = ? 
        ORDER BY ub.id_umpan_balik DESC`,
        [idPelanggan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO umpan_balik SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT ub.*, p.id_pelanggan, pl.nama 
        FROM umpan_balik ub 
        JOIN pesanan p ON ub.id_pesanan = p.id_pesanan
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan 
        WHERE ub.id_umpan_balik = ?`,
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
        "UPDATE umpan_balik SET ? WHERE id_umpan_balik = ?",
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
        "DELETE FROM umpan_balik WHERE id_umpan_balik = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_UmpanBalik; 