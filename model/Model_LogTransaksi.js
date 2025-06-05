/**
 * Model_LogTransaksi Class
 * Kelas ini menangani semua operasi database terkait log transaksi, termasuk:
 * - Pencatatan setiap aktivitas transaksi
 * - Pelacakan perubahan status
 * - Riwayat aktivitas sistem
 * - Operasi CRUD untuk data log transaksi
 */

const connection = require("../config/databases");

class Model_LogTransaksi {
  /**
   * Mengambil semua data log transaksi dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data log transaksi
   * Data diurutkan berdasarkan waktu terbaru
   */
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
      connection.query(
        `SELECT * FROM log_transaksi WHERE id_log = ?`,
        [id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });
  }

  /**
   * Membuat data log transaksi baru
   * @param {Object} data - Objek data log yang berisi informasi aktivitas
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
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

  /**
   * Mengupdate data log transaksi yang sudah ada
   * @param {number} id - ID log yang akan diupdate
   * @param {Object} data - Objek yang berisi data log yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
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

  /**
   * Menghapus data log transaksi
   * @param {number} id - ID log yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
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