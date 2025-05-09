const express = require('express');
const router = express.Router();
const { verifyToken, userOnly, checkUserOwnership } = require('../middleware/authMiddleware');
const db = require('../config/databases');

// Middleware untuk semua route user
router.use(verifyToken, userOnly);

// Mengelola Akun
router.get('/profile', async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT id_user, nama, email, no_hp, alamat, username FROM user WHERE id_user = ?',
            [req.user.id_user]
        );
        res.json({ status: true, data: user[0] });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put('/profile', async (req, res) => {
    const { nama, email, no_hp, alamat, username, password } = req.body;
    try {
        await db.query(
            'UPDATE user SET nama = ?, email = ?, no_hp = ?, alamat = ?, username = ?, password = ? WHERE id_user = ?',
            [nama, email, no_hp, alamat, username, password, req.user.id_user]
        );
        res.json({ status: true, message: 'Profil berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Melihat Unit Forklift
router.get('/units', async (req, res) => {
    try {
        const [units] = await db.query(
            'SELECT id_unit, nama_unit, kapasitas, gambar FROM unit_forklift WHERE status = "tersedia"'
        );
        res.json({ status: true, data: units });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Melihat Operator
router.get('/operators', async (req, res) => {
    try {
        const [operators] = await db.query(
            'SELECT id_operator, nama_operator, no_hp FROM operator WHERE status = "tersedia"'
        );
        res.json({ status: true, data: operators });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Membuat Pemesanan
router.post('/pesanan', async (req, res) => {
    const { id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO pemesanan (id_user, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id_user, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan]
        );
        res.json({ status: true, message: 'Pemesanan berhasil dibuat', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Melihat Pemesanan
router.get('/pesanan', async (req, res) => {
    try {
        const [pesanan] = await db.query(`
            SELECT p.*, uf.nama_unit, o.nama_operator 
            FROM pemesanan p
            JOIN unit_forklift uf ON p.id_unit = uf.id_unit
            JOIN operator o ON p.id_operator = o.id_operator
            WHERE p.id_user = ?
        `, [req.user.id_user]);
        res.json({ status: true, data: pesanan });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Pembayaran
router.post('/pembayaran', async (req, res) => {
    const { id_pemesanan, jumlah, metode, tanggal_pembayaran } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO pembayaran (id_pemesanan, jumlah, metode, tanggal_pembayaran) VALUES (?, ?, ?, ?)',
            [id_pemesanan, jumlah, metode, tanggal_pembayaran]
        );
        res.json({ status: true, message: 'Pembayaran berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.get('/pembayaran', async (req, res) => {
    try {
        const [pembayaran] = await db.query(`
            SELECT pb.*, p.id_pemesanan
            FROM pembayaran pb
            JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
            WHERE p.id_user = ?
        `, [req.user.id_user]);
        res.json({ status: true, data: pembayaran });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengunggah Bukti Transfer
router.post('/bukti-transfer', async (req, res) => {
    const { id_pembayaran, file_bukti, gambar_bukti } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO bukti_transfer (id_pembayaran, file_bukti, gambar_bukti) VALUES (?, ?, ?)',
            [id_pembayaran, file_bukti, gambar_bukti]
        );
        res.json({ status: true, message: 'Bukti transfer berhasil diunggah', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.get('/bukti-transfer', async (req, res) => {
    try {
        const [bukti] = await db.query(`
            SELECT bt.*, pb.id_pemesanan
            FROM bukti_transfer bt
            JOIN pembayaran pb ON bt.id_pembayaran = pb.id_pembayaran
            JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
            WHERE p.id_user = ?
        `, [req.user.id_user]);
        res.json({ status: true, data: bukti });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Melihat Log Transaksi
router.get('/log-transaksi', async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT lt.*
            FROM log_transaksi lt
            JOIN pemesanan p ON lt.id_pemesanan = p.id_pemesanan
            WHERE p.id_user = ?
        `, [req.user.id_user]);
        res.json({ status: true, data: logs });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Memberikan Feedback
router.post('/feedback', async (req, res) => {
    const { id_pemesanan, rating, komentar } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO feedback (id_pemesanan, rating, komentar) VALUES (?, ?, ?)',
            [id_pemesanan, rating, komentar]
        );
        res.json({ status: true, message: 'Feedback berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.get('/feedback', async (req, res) => {
    try {
        const [feedback] = await db.query(`
            SELECT f.*
            FROM feedback f
            JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
            WHERE p.id_user = ?
        `, [req.user.id_user]);
        res.json({ status: true, data: feedback });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = router; 