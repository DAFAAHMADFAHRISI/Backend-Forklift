const connection = require('../config/databases')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Model_Users {
    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT id_user, username, created_at FROM user ORDER BY id_user DESC', (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO user SET ?', Data, (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async getId() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT id_user, username, created_at FROM user WHERE id_user = ?', (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE user SET ? WHERE id_user = ?', [Data, id], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM user WHERE id_user = ?', [id], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    static async getByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, username], (err, rows) => {
                if (err) reject(err)
                else resolve(rows[0])
            })
        })
    }

    static async registerUser(userData) {
        const { nama, email, username, password, no_hp, alamat } = userData;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO user 
            (nama, email, username, password, no_hp, alamat, role) 
            VALUES (?, ?, ?, ?, ?, ?, 'user')
        `;
        
        return new Promise((resolve, reject) => {
            connection.query(query, [nama, email, username, hashedPassword, no_hp, alamat], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async login(username, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM user WHERE username = ? OR email = ?';
            connection.query(sql, [username, username], async (err, results) => {
                if (err) return reject({ status: 500, message: 'Error pada server', error: err });

                if (results.length === 0) {
                    return reject({ status: 401, message: 'Username atau email tidak ditemukan' });
                }

                const user = results[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return reject({ status: 401, message: 'Password salah' });
                }

                const token = jwt.sign(
                    {
                        id_user: user.id_user,
                        username: user.username,
                        nama: user.nama,
                        email: user.email,
                        role: user.role || 'user'
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                resolve({ 
                    token,
                    user: {
                        id_user: user.id_user,
                        nama: user.nama,
                        username: user.username,
                        email: user.email,
                        role: user.role || 'user'
                    }
                });
            });
        });
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Model_Users