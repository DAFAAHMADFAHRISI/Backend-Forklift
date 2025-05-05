const connection = require("../config/databases");

class Model_Pesanan {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT p.*, pl.nama FROM pemesanan p JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan ORDER BY p.id_pemesanan DESC",
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
        "SELECT * FROM pemesanan WHERE id_pelanggan = ? ORDER BY id_pemesanan DESC",
        [idPelanggan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getDetailByPelanggan(idPelanggan) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT 
          p.*,
          u.nama_unit, u.kapasitas,
          o.nama_operator, o.no_hp as no_hp_operator
        FROM pemesanan p
        LEFT JOIN unit_forklift u ON p.id_unit = u.id_unit
        LEFT JOIN operator o ON p.id_operator = o.id_operator
        WHERE p.id_pelanggan = ?
        ORDER BY p.id_pemesanan DESC`,
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
      connection.query("INSERT INTO pemesanan SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT p.*, pl.nama, pl.email, pl.no_hp, pl.alamat FROM pemesanan p JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan WHERE p.id_pemesanan = ?",
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getDetailedById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT 
          p.*,
          pl.nama as nama_pelanggan, pl.email, pl.no_hp, pl.alamat,
          u.nama_unit, u.kapasitas, u.gambar as gambar_unit,
          o.nama_operator, o.no_hp as no_hp_operator
        FROM pemesanan p
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
        LEFT JOIN unit_forklift u ON p.id_unit = u.id_unit
        LEFT JOIN operator o ON p.id_operator = o.id_operator
        WHERE p.id_pemesanan = ?`,
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
        "UPDATE pemesanan SET ? WHERE id_pemesanan = ?",
        [Data, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE pemesanan SET status = ? WHERE id_pemesanan = ?",
        [status, id],
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
        "DELETE FROM pemesanan WHERE id_pemesanan = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_Pesanan; 