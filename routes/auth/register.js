var express = require('express')
var router = express.Router()
var usersModel = require('../../model/Model_Users')

// Route untuk menampilkan halaman register (GET)
router.get('/', (req, res) => {
    res.render('register', { 
        title: 'Register',
        errorMessage: req.query.error,
        successMessage: req.query.success
    });
});

// Route untuk register API dan web form (POST)
router.post('/', async (req, res) => {
    const { nama, email, username, password, no_hp, alamat } = req.body;
    
    // Cek apakah request berasal dari endpoint API (case-insensitive, agar /api/auth/register selalu JSON)
    const isApiRequest = req.originalUrl.toLowerCase().includes('/api/auth/register') ||
                        req.get('User-Agent')?.includes('Postman') || 
                        req.get('Accept')?.includes('application/json') ||
                        req.xhr;
    
    // Validasi input
    if (!username || !password || !email || !nama) {
        const message = 'Semua field wajib harus diisi';
        if (isApiRequest) {
            return res.status(400).json({ status: false, message });
        } else {
            return res.render('register', { 
                title: 'Register',
                errorMessage: message
            });
        }
    }

    try {
        const existingUser = await usersModel.getByUsername(username);
        if (existingUser) {
            const message = 'Username atau email sudah digunakan';
            if (isApiRequest) {
                return res.status(400).json({ status: false, message });
            } else {
                return res.render('register', { 
                    title: 'Register',
                    errorMessage: message
                });
            }
        }

        await usersModel.registerUser({ nama, email, username, password, no_hp, alamat });
        
        if (isApiRequest) {
            return res.status(201).json({ 
                status: true,
                message: 'Register berhasil' 
            });
        } else {
            return res.redirect('/login?success=Pendaftaran berhasil, silakan login');
        }
    } catch (error) {
        console.error('Register error:', error);
        const message = 'Terjadi kesalahan saat mendaftar';
        
        if (isApiRequest) {
            return res.status(500).json({ 
                status: false,
                message: error.message || message
            });
        } else {
            return res.render('register', { 
                title: 'Register',
                errorMessage: error.message || message
            });
        }
    }
});

module.exports = router