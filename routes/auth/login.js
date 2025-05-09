const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../../config/databases')
const rateLimit = require('express-rate-limit')

// Force JWT_SECRET to be set in environment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in .env file!');
}
console.log('Using JWT secret:', JWT_SECRET ? 'Secret is set' : 'NOT SET!');

const loginLimiter = rateLimit({
    windowMs: 7 * 60 * 1000, 
    max: 3, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: false,
        message: "Terlalu banyak percobaan login gagal. Silakan coba lagi setelah 7 menit."
    },
    skipSuccessfulRequests: true 
})

// Route untuk menampilkan halaman login (GET)
router.get('/', (req, res) => {
    res.render('login', { 
        title: 'Login',
        errorMessage: req.query.error,
        successMessage: req.query.success
    });
});

// Route untuk login API dan web form (POST)
router.post('/', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    
    // Cek apakah request berasal dari Postman/API client
    const isApiRequest = req.get('User-Agent')?.includes('Postman') || 
                        req.get('Accept')?.includes('application/json') ||
                        req.xhr;
    
    // Validasi input
    if (!username || !password) {
        const message = !username ? 'Username harus di isi' : 'Password harus di isi';
        if (isApiRequest) {
            return res.status(400).json({ 
                status: false,
                message 
            });
        } else {
            return res.render('login', { 
                title: 'Login',
                errorMessage: message
            });
        }
    }

    // Cari user berdasarkan username menggunakan callback
    db.query('SELECT * FROM user WHERE username = ?', [username], (error, users) => {
        if (error) {
            console.error('Database error:', error);
            if (isApiRequest) {
                return res.status(500).json({ 
                    status: false, 
                    message: 'Terjadi kesalahan pada server'
                });
            } else {
                return res.render('login', { 
                    title: 'Login',
                    errorMessage: 'Terjadi kesalahan pada server'
                });
            }
        }

        if (users.length === 0) {
            if (isApiRequest) {
                return res.status(401).json({ 
                    status: false,
                    message: 'Username atau password salah'
                });
            } else {
                return res.render('login', { 
                    title: 'Login',
                    errorMessage: 'Username atau password salah'
                });
            }
        }

        const user = users[0];

        // Verifikasi password
        bcrypt.compare(password, user.password, (err, isValidPassword) => {
            if (err) {
                console.error('Password comparison error:', err);
                if (isApiRequest) {
                    return res.status(500).json({ 
                        status: false, 
                        message: 'Terjadi kesalahan pada server'
                    });
                } else {
                    return res.render('login', { 
                        title: 'Login',
                        errorMessage: 'Terjadi kesalahan pada server'
                    });
                }
            }

            if (!isValidPassword) {
                if (isApiRequest) {
                    return res.status(401).json({ 
                        status: false,
                        message: 'Username atau password salah'
                    });
                } else {
                    return res.render('login', { 
                        title: 'Login',
                        errorMessage: 'Username atau password salah'
                    });
                }
            }

            try {
                // Generate JWT token
                const token = jwt.sign(
                    { 
                        id_user: user.id_user,
                        username: user.username,
                        role: user.role
                    },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                if (isApiRequest) {
                    // API response
                    return res.json({ 
                        status: true, 
                        message: 'Login berhasil',
                        data: {
                            token,
                            user: {
                                id_user: user.id_user,
                                username: user.username,
                                nama: user.nama,
                                email: user.email,
                                role: user.role
                            }
                        }
                    });
                } else {
                    // Web form response
                    req.session.user = { 
                        id_user: user.id_user,
                        username: user.username,
                        nama: user.nama,
                        role: user.role,
                        isLoggedIn: true 
                    };
                    return res.redirect('/?success=Login berhasil');
                }
            } catch (error) {
                console.error('JWT signing error:', error);
                if (isApiRequest) {
                    return res.status(500).json({ 
                        status: false, 
                        message: 'Terjadi kesalahan pada server'
                    });
                } else {
                    return res.render('login', { 
                        title: 'Login',
                        errorMessage: 'Terjadi kesalahan pada server'
                    });
                }
            }
        });
    });
});

module.exports = router