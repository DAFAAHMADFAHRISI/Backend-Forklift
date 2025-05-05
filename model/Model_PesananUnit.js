const connection = require("../config/databases");

class Model_PesananUnit {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pesanan_unit ORDER BY id_pesanan_unit DESC",
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
        `SELECT pu.*, u.nama_unit, u.tipe_unit, u.kapasitas, 
        o.nama as nama_operator, o.telepon as telepon_operator
        FROM pesanan_unit pu 
        JOIN unit u ON pu.id_unit = u.id_unit 
        LEFT JOIN operator o ON pu.id_operator = o.id_operator 
        WHERE pu.id_pesanan = ?`,
        [idPesanan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO pesanan_unit SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT pu.*, u.nama_unit, u.tipe_unit, u.kapasitas, 
        o.nama as nama_operator, o.telepon as telepon_operator  
        FROM pesanan_unit pu 
        JOIN unit u ON pu.id_unit = u.id_unit 
        LEFT JOIN operator o ON pu.id_operator = o.id_operator 
        WHERE pu.id_pesanan_unit = ?`,
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
        "UPDATE pesanan_unit SET ? WHERE id_pesanan_unit = ?",
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
        "DELETE FROM pesanan_unit WHERE id_pesanan_unit = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static async deleteByPesanan(idPesanan) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM pesanan_unit WHERE id_pesanan = ?",
        [idPesanan],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_PesananUnit; 