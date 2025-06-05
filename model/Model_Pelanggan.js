/**
 * Model_Pelanggan Class
 * Kelas ini menangani semua operasi database terkait data pelanggan, termasuk:
 * - Pembuatan dan pengelolaan data pelanggan
 * - Pencatatan informasi kontak pelanggan
 * - Pelacakan riwayat pemesanan pelanggan
 * - Operasi CRUD untuk data pelanggan
 */

const connection = require("../config/databases");

class Model_Pelanggan {
  /**
   * Mengambil semua data pelanggan dari database
   * @returns {Promise} Mengembalikan promise yang berisi array data pelanggan
   * Data diurutkan berdasarkan ID terbaru
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan ORDER BY id_pelanggan DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  /**
   * Membuat data pelanggan baru
   * @param {Object} data - Objek data pelanggan yang berisi informasi pelanggan
   * @returns {Promise} Mengembalikan promise yang berisi hasil insert
   */
  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO pelanggan SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Mengambil data pelanggan berdasarkan ID
   * @param {number} id - ID pelanggan yang dicari
   * @returns {Promise} Mengembalikan promise yang berisi data pelanggan
   */
  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan WHERE id_pelanggan = ?",
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan WHERE email = ?",
        [email],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPhone(no_hp) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan WHERE no_hp = ?",
        [no_hp],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async search(keyword) {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${keyword}%`;
      connection.query(
        "SELECT * FROM pelanggan WHERE nama LIKE ? OR email LIKE ? OR no_hp LIKE ? OR alamat LIKE ? ORDER BY id_pelanggan DESC",
        [searchQuery, searchQuery, searchQuery, searchQuery],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  /**
   * Mengupdate data pelanggan yang sudah ada
   * @param {number} id - ID pelanggan yang akan diupdate
   * @param {Object} data - Objek yang berisi data pelanggan yang akan diupdate
   * @returns {Promise} Mengembalikan promise yang berisi hasil update
   */
  static async update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE pelanggan SET ? WHERE id_pelanggan = ?",
        [Data, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  /**
   * Menghapus data pelanggan
   * @param {number} id - ID pelanggan yang akan dihapus
   * @returns {Promise} Mengembalikan promise yang berisi hasil delete
   */
  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM pelanggan WHERE id_pelanggan = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  /**
   * Mengambil riwayat pemesanan pelanggan
   * @param {number} id_pelanggan - ID pelanggan
   * @returns {Promise} Mengembalikan promise yang berisi array riwayat pemesanan
   */
  static async getRiwayatPemesanan(id_pelanggan) {
    // ... existing code ...
  }
}

module.exports = Model_Pelanggan; 