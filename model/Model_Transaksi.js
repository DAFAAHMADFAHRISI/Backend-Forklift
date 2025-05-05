const connection = require("../config/databases");

class Model_Transaksi {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT t.*, p.id_pelanggan, pl.nama 
        FROM transaksi t 
        JOIN pesanan p ON t.id_pesanan = p.id_pesanan
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan 
        ORDER BY t.id_transaksi DESC`,
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
        "SELECT * FROM transaksi WHERE id_pesanan = ? ORDER BY id_transaksi DESC",
        [idPesanan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByStatus(status) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT t.*, p.id_pelanggan, pl.nama 
        FROM transaksi t 
        JOIN pesanan p ON t.id_pesanan = p.id_pesanan
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan 
        WHERE t.status = ? 
        ORDER BY t.id_transaksi DESC`,
        [status],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO transaksi SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT t.*, p.id_pelanggan, p.total_harga, p.status_pembayaran, pl.nama, pl.email, pl.telepon
        FROM transaksi t 
        JOIN pesanan p ON t.id_pesanan = p.id_pesanan
        JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan 
        WHERE t.id_transaksi = ?`,
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
        "UPDATE transaksi SET ? WHERE id_transaksi = ?",
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
        "UPDATE transaksi SET status = ? WHERE id_transaksi = ?",
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
        "DELETE FROM transaksi WHERE id_transaksi = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_Transaksi; 