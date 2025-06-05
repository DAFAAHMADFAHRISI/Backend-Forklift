/**
 * Model_Feedback Class
 * Kelas ini menangani semua operasi database terkait umpan balik (feedback), termasuk:
 * - Pembuatan dan pengelolaan data feedback
 * - Pencatatan rating dan komentar
 * - Pelacakan feedback per pemesanan
 * - Operasi CRUD untuk data feedback
 */

const connection = require("../config/databases");

class Model_Feedback {
  /**
   * Mengambil semua data feedback dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data feedback
   * Data diurutkan berdasarkan ID terbaru
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT f.*, p.id_user 
        FROM feedback f
        JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
        ORDER BY f.id_feedback DESC
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
        SELECT f.* 
        FROM feedback f
        JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
        WHERE p.id_user = ?
        ORDER BY f.id_feedback DESC
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
        SELECT f.*, p.id_user 
        FROM feedback f
        JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
        WHERE f.id_feedback = ?
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
   * Membuat data feedback baru
   * @param {Object} data - Objek data feedback yang berisi rating dan komentar
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
  static async Store(data) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO feedback SET ?', data, (err, result) => {
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
      connection.query('INSERT INTO feedback SET ?', data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Mengupdate data feedback yang sudah ada
   * @param {number} id - ID feedback yang akan diupdate
   * @param {Object} data - Objek yang berisi data feedback yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
  static async Update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE feedback SET ? WHERE id_feedback = ?', [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Menghapus data feedback
   * @param {number} id - ID feedback yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM feedback WHERE id_feedback = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Mengambil data feedback berdasarkan ID pemesanan
   * @param {number} id_pemesanan - ID pemesanan yang terkait
   * @returns {Promise} Mengembalikan promise yang berisi data feedback
   */
  static async getByPemesanan(id_pemesanan) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT f.*, p.id_user 
         FROM feedback f
         JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
         WHERE f.id_pemesanan = ?
         ORDER BY f.id_feedback DESC`,
        [id_pemesanan],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM feedback WHERE id_feedback = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Model_Feedback; 