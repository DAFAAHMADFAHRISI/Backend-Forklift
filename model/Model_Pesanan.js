/**
 * Model_Pesanan Class
 * Handles all database operations related to order management including:
 * - Creating and managing forklift rental orders
 * - Retrieving order details with related information
 * - Updating order status and information
 * - Managing relationships between orders, users, units, and operators
 */

const connection = require("../config/databases");

class Model_Pesanan {
  /**
   * Retrieves all orders with related user, unit, and operator information
   * @returns {Promise} Returns a promise that resolves with an array of orders
   * Each order includes user name, unit name, and operator name
   */
  static async getAll() {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT p.*, u.nama as nama_user, f.nama_unit, o.nama_operator 
        FROM pemesanan p
        LEFT JOIN user u ON p.id_user = u.id_user
        LEFT JOIN unit_forklift f ON p.id_unit = f.id_unit
        LEFT JOIN operator o ON p.id_operator = o.id_operator
        ORDER BY p.id_pemesanan DESC
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
   * Retrieves all orders for a specific user
   * @param {number} id_user - The ID of the user
   * @returns {Promise} Returns a promise that resolves with an array of user's orders
   * Includes related user, unit, and operator information
   */
  static async getByUserId(id_user) {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT p.*, u.nama as nama_user, f.nama_unit, o.nama_operator 
        FROM pemesanan p
        LEFT JOIN user u ON p.id_user = u.id_user
        LEFT JOIN unit_forklift f ON p.id_unit = f.id_unit
        LEFT JOIN operator o ON p.id_operator = o.id_operator
        WHERE p.id_user = ?
        ORDER BY p.id_pemesanan DESC
      `, [id_user], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Retrieves detailed order information for a specific customer
   * @param {number} idPelanggan - The ID of the customer
   * @returns {Promise} Returns a promise that resolves with an array of orders
   * Includes unit and operator details
   */
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

  /**
   * Creates a new order in the database
   * @param {Object} Data - Order data object containing order information
   * @returns {Promise} Returns a promise that resolves with the insert result
   */
  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO pemesanan SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Retrieves a specific order by its ID
   * @param {number} id - The ID of the order
   * @returns {Promise} Returns a promise that resolves with the order data
   * Includes related user, unit, and operator information
   */
  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(`
        SELECT p.*, u.nama as nama_user, f.nama_unit, o.nama_operator 
        FROM pemesanan p
        LEFT JOIN user u ON p.id_user = u.id_user
        LEFT JOIN unit_forklift f ON p.id_unit = f.id_unit
        LEFT JOIN operator o ON p.id_operator = o.id_operator
        WHERE p.id_pemesanan = ?
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
   * Retrieves detailed information for a specific order
   * @param {number} id - The ID of the order
   * @returns {Promise} Returns a promise that resolves with detailed order information
   * Includes customer details, unit information, and operator details
   */
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

  /**
   * Updates an existing order's information
   * @param {number} id - The ID of the order to update
   * @param {Object} Data - Object containing the updated order data
   * @returns {Promise} Returns a promise that resolves with the update result
   */
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

  /**
   * Updates the status of an order
   * @param {number} id - The ID of the order
   * @param {string} status - The new status to set
   * @returns {Promise} Returns a promise that resolves with the update result
   */
  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE pemesanan SET status = ? WHERE id_pemesanan = ?', [status, id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Deletes an order from the database
   * @param {number} id - The ID of the order to delete
   * @returns {Promise} Returns a promise that resolves with the delete result
   */
  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM pemesanan WHERE id_pemesanan = ?', [id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Model_Pesanan; 