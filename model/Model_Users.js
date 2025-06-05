/**
 * Model_Users Class
 * Handles all database operations related to user management including:
 * - User registration and authentication
 * - CRUD operations for user data
 * - Password hashing and verification
 */

const connection = require('../config/databases')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class Model_Users {
    /**
     * Retrieves all users from the database
     * @returns {Promise} Returns a promise that resolves with an array of user data
     * Only returns non-sensitive user information (id, username, created_at)
     */
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

    /**
     * Creates a new user record in the database
     * @param {Object} Data - User data object containing user information
     * @returns {Promise} Returns a promise that resolves with the insert result
     */
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

    /**
     * Retrieves a specific user by their ID
     * @returns {Promise} Returns a promise that resolves with the user data
     * Only returns non-sensitive user information
     */
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

    /**
     * Updates an existing user's information
     * @param {number} id - The ID of the user to update
     * @param {Object} Data - Object containing the updated user data
     * @returns {Promise} Returns a promise that resolves with the update result
     */
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

    /**
     * Deletes a user from the database
     * @param {number} id - The ID of the user to delete
     * @returns {Promise} Returns a promise that resolves with the delete result
     */
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

    /**
     * Retrieves a user by their username or email
     * @param {string} username - Username or email to search for
     * @returns {Promise} Returns a promise that resolves with the user data
     */
    static async getByUsername(username) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM user WHERE username = ? OR email = ?', [username, username], (err, rows) => {
                if (err) reject(err)
                else resolve(rows[0])
            })
        })
    }

    /**
     * Registers a new user with hashed password
     * @param {Object} userData - Object containing user registration data
     * @param {string} userData.nama - User's full name
     * @param {string} userData.email - User's email address
     * @param {string} userData.username - User's username
     * @param {string} userData.password - User's plain text password
     * @param {string} userData.no_hp - User's phone number
     * @param {string} userData.alamat - User's address
     * @returns {Promise} Returns a promise that resolves with the registration result
     */
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

    /**
     * Authenticates a user and generates a JWT token
     * @param {string} username - Username or email for login
     * @param {string} password - Plain text password
     * @returns {Promise} Returns a promise that resolves with token and user data
     * @throws {Object} Throws an error object with status and message if authentication fails
     */
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

    /**
     * Verifies if a plain text password matches a hashed password
     * @param {string} plainPassword - Plain text password to verify
     * @param {string} hashedPassword - Hashed password to compare against
     * @returns {Promise<boolean>} Returns a promise that resolves with true if passwords match
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Model_Users