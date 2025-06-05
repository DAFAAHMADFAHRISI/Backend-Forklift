/**
 * Model_UnitForklift Class
 * Handles all database operations related to forklift unit management including:
 * - Creating and managing forklift units
 * - Tracking unit availability
 * - Managing unit details and status
 * - CRUD operations for unit data
 */

const connection = require('../config/databases');

class Model_UnitForklift {
    /**
     * Retrieves all forklift units from the database
     * @returns {Promise} Returns a promise that resolves with an array of all units
     * Units are ordered by ID in descending order (newest first)
     */
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM unit_forklift 
                ORDER BY id_unit DESC
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
     * Retrieves only available forklift units
     * @returns {Promise} Returns a promise that resolves with an array of available units
     * Only returns units with status 'tersedia' (available)
     */
    static async getAvailable() {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM unit_forklift 
                WHERE status = 'tersedia'
                ORDER BY id_unit DESC
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
     * Retrieves a specific forklift unit by its ID
     * @param {number} id - The ID of the unit to retrieve
     * @returns {Promise} Returns a promise that resolves with the unit data
     */
    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query(`
                SELECT * FROM unit_forklift 
                WHERE id_unit = ?
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
     * Creates a new forklift unit in the database
     * @param {Object} data - Unit data object containing unit information
     * @returns {Promise} Returns a promise that resolves with the insert result
     */
    static async Store(data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO unit_forklift SET ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Updates an existing forklift unit's information
     * @param {number} id - The ID of the unit to update
     * @param {Object} data - Object containing the updated unit data
     * @returns {Promise} Returns a promise that resolves with the update result
     */
    static async Update(id, data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE unit_forklift SET ? WHERE id_unit = ?', [data, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Deletes a forklift unit from the database
     * @param {number} id - The ID of the unit to delete
     * @returns {Promise} Returns a promise that resolves with the delete result
     */
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM unit_forklift WHERE id_unit = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = Model_UnitForklift; 