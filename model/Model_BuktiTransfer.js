/**
 * Model_BuktiTransfer Class
 * Kelas ini menangani semua operasi database terkait bukti transfer pembayaran, termasuk:
 * - Pembuatan dan pengelolaan data bukti transfer
 * - Verifikasi bukti transfer
 * - Pelacakan status verifikasi
 * - Operasi CRUD untuk data bukti transfer
 */

const connection = require("../config/databases");

class Model_BuktiTransfer {
  /**
   * Mengambil semua data bukti transfer dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data bukti transfer
   * Data diurutkan berdasarkan ID terbaru
   */
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

  /**
   * Membuat data bukti transfer baru
   * @param {Object} data - Objek data bukti transfer yang berisi informasi bukti
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
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

  /**
   * Mengupdate data bukti transfer yang sudah ada
   * @param {number} id - ID bukti transfer yang akan diupdate
   * @param {Object} data - Objek yang berisi data bukti transfer yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
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

  /**
   * Menghapus data bukti transfer
   * @param {number} id - ID bukti transfer yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
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