const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const db = require('../config/databases');
const Model_Pemesanan = require('../model/Model_Pemesanan');
const { createLogTransaksi } = require('../helpers/logHelper');
const Model_Unit = require('../model/Model_Unit');
const Model_Pesanan = require('../model/Model_Pesanan');

// Middleware untuk semua route admin
router.use(verifyToken, adminOnly);

// Mengelola User
router.get('/users', (req, res) => {
    db.query('SELECT id_user, nama, email, no_hp, alamat, username, role FROM user WHERE role = "user"', (error, results) => {
        if (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
        res.json({ status: true, data: results });
    });
});

router.post('/users', async (req, res) => {
    const { nama, email, no_hp, alamat, username, password, role } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO user (nama, email, no_hp, alamat, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nama, email, no_hp, alamat, username, password, role]
        );
        res.json({ status: true, message: 'User berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, email, no_hp, alamat, username, role } = req.body;
    try {
        await db.query(
            'UPDATE user SET nama = ?, email = ?, no_hp = ?, alamat = ?, username = ?, role = ? WHERE id_user = ?',
            [nama, email, no_hp, alamat, username, role, id]
        );
        res.json({ status: true, message: 'User berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM user WHERE id_user = ?', [id]);
        res.json({ status: true, message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Unit Forklift
router.get('/units', async (req, res) => {
    try {
        const [units] = await db.query('SELECT * FROM unit_forklift');
        res.json({ status: true, data: units });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.post('/units', async (req, res) => {
    const { nama_unit, kapasitas, gambar, harga_per_jam } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO unit_forklift (nama_unit, kapasitas, gambar, harga_per_jam) VALUES (?, ?, ?, ?)',
            [nama_unit, kapasitas, gambar, harga_per_jam || 300000.00]
        );
        res.json({ status: true, message: 'Unit berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put('/units/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_unit, kapasitas, gambar, status, harga_per_jam } = req.body;
    try {
        await db.query(
            'UPDATE unit_forklift SET nama_unit = ?, kapasitas = ?, gambar = ?, status = ?, harga_per_jam = ? WHERE id_unit = ?',
            [nama_unit, kapasitas, gambar, status, harga_per_jam, id]
        );
        res.json({ status: true, message: 'Unit berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.delete('/units/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM unit_forklift WHERE id_unit = ?', [id]);
        res.json({ status: true, message: 'Unit berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Operator
router.get('/operators', async (req, res) => {
    try {
        const [operators] = await db.query('SELECT * FROM operator');
        res.json({ status: true, data: operators });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.post('/operators', async (req, res) => {
    const { nama_operator, no_hp } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO operator (nama_operator, no_hp) VALUES (?, ?)',
            [nama_operator, no_hp]
        );
        res.json({ status: true, message: 'Operator berhasil ditambahkan', id: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put('/operators/:id', async (req, res) => {
    const { id } = req.params;
    const { nama_operator, no_hp, status } = req.body;
    try {
        await db.query(
            'UPDATE operator SET nama_operator = ?, no_hp = ?, status = ? WHERE id_operator = ?',
            [nama_operator, no_hp, status, id]
        );
        res.json({ status: true, message: 'Operator berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.delete('/operators/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM operator WHERE id_operator = ?', [id]);
        res.json({ status: true, message: 'Operator berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Pemesanan
router.get('/pesanan', async (req, res) => {
    try {
        const [pesanan] = await db.query(`
            SELECT p.*, u.nama as nama_user, uf.nama_unit, o.nama_operator 
            FROM pemesanan p
            JOIN user u ON p.id_user = u.id_user
            JOIN unit_forklift uf ON p.id_unit = uf.id_unit
            JOIN operator o ON p.id_operator = o.id_operator
        `);
        res.json({ status: true, data: pesanan });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put('/pesanan/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await Model_Pesanan.updateStatus(id, status);

        // Jika status selesai, update status unit menjadi tersedia
        if (status === 'selesai') {
            const pesanan = await Model_Pesanan.getId(id);
            console.log('DEBUG: Data pesanan untuk update status unit:', pesanan);
            if (pesanan && pesanan.id_unit) {
                try {
                    const result = await Model_Unit.updateStatus(pesanan.id_unit, 'tersedia');
                    console.log(`DEBUG: Update status unit ${pesanan.id_unit} ke 'tersedia', hasil:`, result);
                } catch (err) {
                    console.error('ERROR: Gagal update status unit:', err);
                }
            } else {
                console.warn('WARNING: id_unit tidak ditemukan pada pesanan, tidak bisa update status unit!');
            }
        }
        res.json({ status: true, message: 'Status pemesanan berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Pembayaran
router.get('/pembayaran', async (req, res) => {
    try {
        const [pembayaran] = await db.query(`
            SELECT pb.*, p.id_user, u.nama as nama_user
            FROM pembayaran pb
            JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
            JOIN user u ON p.id_user = u.id_user
        `);
        res.json({ status: true, data: pembayaran });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Bukti Transfer
router.get('/bukti-transfer', async (req, res) => {
    try {
        const [bukti] = await db.query(`
            SELECT bt.*, p.id_user, u.nama as nama_user
            FROM bukti_transfer bt
            JOIN pembayaran pb ON bt.id_pembayaran = pb.id_pembayaran
            JOIN pemesanan p ON pb.id_pemesanan = p.id_pemesanan
            JOIN user u ON p.id_user = u.id_user
        `);
        res.json({ status: true, data: bukti });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.put('/bukti-transfer/:id/verifikasi', async (req, res) => {
    const { id } = req.params;
    const { status_verifikasi } = req.body;
    try {
        await db.query(
            'UPDATE bukti_transfer SET status_verifikasi = ? WHERE id_bukti = ?',
            [status_verifikasi, id]
        );
        res.json({ status: true, message: 'Status verifikasi berhasil diupdate' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Log Transaksi
router.get('/log-transaksi', async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT lt.*, p.id_user, u.nama as nama_user
            FROM log_transaksi lt
            JOIN pemesanan p ON lt.id_pemesanan = p.id_pemesanan
            JOIN user u ON p.id_user = u.id_user
        `);
        res.json({ status: true, data: logs });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mengelola Feedback
router.get('/feedback', async (req, res) => {
    try {
        const [feedback] = await db.query(`
            SELECT f.*, p.id_user, u.nama as nama_user
            FROM feedback f
            JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan
            JOIN user u ON p.id_user = u.id_user
        `);
        res.json({ status: true, data: feedback });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Laporan
router.get('/laporan/pemesanan', async (req, res) => {
    try {
        const [laporan] = await db.query(`
            SELECT 
                DATE(tanggal_mulai) as tanggal,
                COUNT(*) as total_pemesanan,
                SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
                SUM(CASE WHEN status = 'menunggu pembayaran' THEN 1 ELSE 0 END) as menunggu_pembayaran,
                SUM(CASE WHEN status = 'menunggu konfirmasi' THEN 1 ELSE 0 END) as menunggu_konfirmasi,
                SUM(CASE WHEN status = 'dikirim' THEN 1 ELSE 0 END) as dikirim
            FROM pemesanan
            GROUP BY DATE(tanggal_mulai)
            ORDER BY tanggal DESC
        `);
        res.json({ status: true, data: laporan });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

router.get('/laporan/pembayaran', async (req, res) => {
    try {
        const [laporan] = await db.query(`
            SELECT 
                DATE(tanggal_pembayaran) as tanggal,
                COUNT(*) as total_pembayaran,
                SUM(jumlah) as total_jumlah
            FROM pembayaran
            GROUP BY DATE(tanggal_pembayaran)
            ORDER BY tanggal DESC
        `);
        res.json({ status: true, data: laporan });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Mendapatkan daftar pemesanan dengan status pembayaran
router.get('/pemesanan-pembayaran', verifyToken, adminOnly, async (req, res) => {
    try {
        const [pemesanan] = await db.query(`
            SELECT 
                p.*,
                u.nama as nama_user,
                f.nama_unit,
                o.nama_operator,
                pb.jumlah as jumlah_pembayaran,
                pb.metode as metode_pembayaran,
                pb.tanggal_pembayaran,
                bt.file_bukti,
                bt.gambar_bukti,
                bt.tanggal_upload,
                bt.status_verifikasi
            FROM pemesanan p
            LEFT JOIN user u ON p.id_user = u.id_user
            LEFT JOIN unit_forklift f ON p.id_unit = f.id_unit
            LEFT JOIN operator o ON p.id_operator = o.id_operator
            LEFT JOIN pembayaran pb ON p.id_pemesanan = pb.id_pemesanan
            LEFT JOIN bukti_transfer bt ON pb.id_pembayaran = bt.id_pembayaran
            WHERE p.status IN ('menunggu pembayaran', 'menunggu konfirmasi')
            ORDER BY p.id_pemesanan DESC
        `);
        res.json({ status: true, data: pemesanan });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Verifikasi pembayaran dan update status pemesanan
router.put('/verifikasi-pembayaran/:id_pemesanan', verifyToken, adminOnly, async (req, res) => {
    try {
        const { id_pemesanan } = req.params;
        const { status, catatan } = req.body;

        // Validasi status
        if (!['diterima', 'ditolak'].includes(status)) {
            return res.status(400).json({
                status: false,
                message: 'Status harus berupa "diterima" atau "ditolak"'
            });
        }

        // Update status pemesanan
        const newStatus = status === 'diterima' ? 'menunggu konfirmasi' : 'menunggu pembayaran';
        await Model_Pemesanan.updateStatus(id_pemesanan, newStatus);

        // Buat log transaksi
        await createLogTransaksi(
            id_pemesanan,
            `verifikasi_pembayaran_${status}`,
            catatan || `Pembayaran ${status} oleh admin`
        );

        res.json({
            status: true,
            message: `Pembayaran berhasil ${status}`,
            data: { status: newStatus }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Gagal memverifikasi pembayaran',
            error: error.message
        });
    }
});

module.exports = router; 