/**
 * Model_Transaksi Class
 * Kelas ini menangani semua operasi database terkait transaksi, termasuk:
 * - Pembuatan dan pengelolaan data transaksi
 * - Pencatatan detail pembayaran
 * - Pelacakan status transaksi
 * - Operasi CRUD untuk data transaksi
 */

const connection = require("../config/databases");

class Model_Transaksi {
  /**
   * Mengambil semua data transaksi dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data transaksi
   * Data diurutkan berdasarkan ID terbaru
   */
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

  /**
   * Membuat data transaksi baru
   * @param {Object} data - Objek data transaksi yang berisi informasi transaksi
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO transaksi SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Mengambil data transaksi berdasarkan ID
   * @param {number} id - ID transaksi yang dicari
   * @returns {Promise} Mengembalikan promise yang berisi data transaksi
   */
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

  /**
   * Mengupdate data transaksi yang sudah ada
   * @param {number} id - ID transaksi yang akan diupdate
   * @param {Object} data - Objek yang berisi data transaksi yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
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

  /**
   * Mengupdate status transaksi
   * @param {number} id - ID transaksi
   * @param {string} status - Status transaksi baru
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
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

  /**
   * Menghapus data transaksi
   * @param {number} id - ID transaksi yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
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

  /**
   * Mengambil riwayat transaksi pelanggan
   * @param {number} id_pelanggan - ID pelanggan
   * @returns {Promise} Mengembalikan promise yang berisi array riwayat transaksi
   */
  static async getRiwayatTransaksi(id_pelanggan) {
    // ... existing code ...
  }
}

module.exports = Model_Transaksi; 