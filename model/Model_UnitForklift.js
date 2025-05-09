const connection = require('../config/databases');

class Model_UnitForklift {
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