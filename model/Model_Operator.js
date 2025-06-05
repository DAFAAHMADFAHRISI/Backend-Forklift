/**
 * Model_Operator Class
 * Kelas ini menangani semua operasi database terkait operator forklift, termasuk:
 * - Pembuatan dan pengelolaan data operator
 * - Pelacakan status operator
 * - Pengelolaan jadwal operator
 * - Operasi CRUD untuk data operator
 */

const connection = require("../config/databases");

class Model_Operator {
  /**
   * Mengambil semua data operator dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data operator
   * Data diurutkan berdasarkan ID terbaru
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT * FROM operator 
        ORDER BY id_operator DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Mengambil data operator yang tersedia (tidak sedang bertugas)
   * @returns {Promise} Mengembalikan promise yang berisi array operator yang tersedia
   */
  static async getAvailable() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT * FROM operator 
        WHERE status = 'tersedia'
        ORDER BY id_operator DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Mengambil data operator berdasarkan ID
   * @param {number} id - ID operator yang dicari
   * @returns {Promise} Mengembalikan promise yang berisi data operator
   */
  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT * FROM operator 
        WHERE id_operator = ?
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
   * Membuat data operator baru
   * @param {Object} data - Objek data operator yang berisi informasi operator
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
  static async store(data) {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO operator SET ?', data, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Mengupdate data operator yang sudah ada
   * @param {number} id - ID operator yang akan diupdate
   * @param {Object} data - Objek yang berisi data operator yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
  static async Update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE operator SET ? WHERE id_operator = ?', [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Menghapus data operator
   * @param {number} id - ID operator yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
  static async Delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM operator WHERE id_operator = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async update(id, data) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE operator SET ? WHERE id_operator = ?', [data, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM operator WHERE id_operator = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = Model_Operator; 