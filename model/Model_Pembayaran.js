/**
 * Model_Pembayaran Class
 * Kelas ini menangani semua operasi database terkait pembayaran, termasuk:
 * - Pembuatan dan pengelolaan data pembayaran
 * - Pencatatan detail pembayaran
 * - Pelacakan status pembayaran
 * - Operasi CRUD untuk data pembayaran
 */

const connection = require("../config/databases");

class Model_Pembayaran {
  /**
   * Mengambil semua data pembayaran dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data pembayaran
   * Data diurutkan berdasarkan ID terbaru
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT p.*, ps.id_user 
        FROM pembayaran p
        JOIN pemesanan ps ON p.id_pemesanan = ps.id_pemesanan
        ORDER BY p.id_pembayaran DESC
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
        SELECT p.* 
        FROM pembayaran p
        JOIN pemesanan ps ON p.id_pemesanan = ps.id_pemesanan
        WHERE ps.id_user = ?
        ORDER BY p.id_pembayaran DESC
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
        SELECT p.*, ps.id_user 
        FROM pembayaran p
        JOIN pemesanan ps ON p.id_pemesanan = ps.id_pemesanan
        WHERE p.id_pembayaran = ?
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
   * Membuat data pembayaran baru
   * @param {Object} data - Objek data pembayaran yang berisi informasi pembayaran
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
  static async Store(data) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO pembayaran SET ?', data, (err, result) => {
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
      connection.query('INSERT INTO pembayaran SET ?', data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Mengupdate data pembayaran yang sudah ada
   * @param {number} id - ID pembayaran yang akan diupdate
   * @param {Object} data - Objek yang berisi data pembayaran yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
  static async Update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE pembayaran SET ? WHERE id_pembayaran = ?', [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Menghapus data pembayaran
   * @param {number} id - ID pembayaran yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM pembayaran WHERE id_pembayaran = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async getByOrderId(orderId) {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM pembayaran WHERE order_id = ?',
        [orderId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]); // Return first matching record
          }
        }
      );
    });
  }

  static async updateByOrderId(orderId, data) {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE pembayaran SET ? WHERE order_id = ?',
        [data, orderId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }
}

module.exports = Model_Pembayaran; 