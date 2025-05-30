const express = require('express');
const Model_Pesanan = require('../model/Model_Pesanan');
const router = express.Router();
const { verifyToken, adminOnly, userOnly } = require('../middleware/authMiddleware');

// GET - Mendapatkan semua pesanan (admin) atau pesanan user (user)
router.get('/', verifyToken, async (req, res) => {
    try {
        let pesanan;
        if (req.user.role === 'admin') {
            pesanan = await Model_Pesanan.getAll();
        } else {
            pesanan = await Model_Pesanan.getByUserId(req.user.id_user);
        }
        res.json({
            status: true,
            pesan: 'Daftar pesanan berhasil diambil',
            data: pesanan
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            pesan: 'Terjadi kesalahan saat mengambil data pesanan'
        });
    }
});

// GET - Mendapatkan detail pesanan berdasarkan ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const pesanan = await Model_Pesanan.getId(req.params.id);
        
        if (!pesanan || pesanan.length === 0) {
            return res.status(404).json({
                status: false,
                pesan: 'Pesanan tidak ditemukan'
            });
        }

        // Cek apakah user memiliki akses ke pesanan ini
        if (req.user.role !== 'admin' && pesanan[0].id_user !== req.user.id_user) {
            return res.status(403).json({
                status: false,
                pesan: 'Akses ditolak. Ini bukan pesanan Anda'
            });
        }

        res.json({
            status: true,
            pesan: 'Detail pesanan berhasil diambil',
            data: pesanan[0]
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            pesan: 'Gagal mengambil detail pesanan'
        });
    }
});

// POST - Membuat pesanan baru (user only)
router.post('/', verifyToken, userOnly, async (req, res) => {
    try {
        const { id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan } = req.body;
        
        // Validasi input
        if (!id_unit || !tanggal_mulai || !tanggal_selesai || !lokasi_pengiriman) {
            return res.status(400).json({
                status: false,
                pesan: 'Mohon lengkapi semua data yang diperlukan'
            });
        }

        const pesananData = {
            id_user: req.user.id_user,
            id_unit,
            id_operator,
            tanggal_mulai,
            tanggal_selesai,
            lokasi_pengiriman,
            nama_perusahaan,
            status: 'menunggu pembayaran'
        };

        const result = await Model_Pesanan.store(pesananData);
        res.status(201).json({
            status: true,
            pesan: 'Pesanan berhasil dibuat',
            id_pemesanan: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            pesan: 'Gagal membuat pesanan',
            error: error.message
        });
    }
});

// POST - Alias untuk membuat pesanan baru (user only)
router.post('/store', verifyToken, userOnly, async (req, res) => {
    try {
        const { id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan } = req.body;
        
        // Validasi input
        if (!id_unit || !tanggal_mulai || !tanggal_selesai || !lokasi_pengiriman) {
            return res.status(400).json({
                status: false,
                pesan: 'Mohon lengkapi semua data yang diperlukan'
            });
        }

        const pesananData = {
            id_user: req.user.id_user,
            id_unit,
            id_operator,
            tanggal_mulai,
            tanggal_selesai,
            lokasi_pengiriman,
            nama_perusahaan,
            status: 'menunggu pembayaran'
        };

        const result = await Model_Pesanan.store(pesananData);
        res.status(201).json({
            status: true,
            pesan: 'Pesanan berhasil dibuat',
            id_pemesanan: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            pesan: 'Gagal membuat pesanan',
            error: error.message
        });
    }
});

// PUT - Update status pesanan (admin only)
router.put('/:id/status', verifyToken, adminOnly, async (req, res) => {
    try {
        const allowedStatus = ['menunggu pembayaran', 'menunggu konfirmasi', 'dikirim', 'selesai'];
        const { status } = req.body;
        
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                status: false,
                pesan: 'Status tidak valid'
            });
        }

        const result = await Model_Pesanan.updateStatus(req.params.id, status);
        res.json({
            status: true,
            pesan: 'Status pesanan berhasil diperbarui',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            pesan: 'Gagal memperbarui status pesanan'
        });
    }
});

// GET - Mendapatkan pesanan berdasarkan ID pelanggan (admin only)
router.get('/pelanggan/:id', verifyToken, adminOnly, async (req, res) => {
    try {
        const idPelanggan = req.params.id;
        const pesanan = await Model_Pesanan.getByPelanggan(idPelanggan);
        
        res.status(200).json({
            status: true,
            pesan: 'Data pesanan pelanggan berhasil diambil',
            data: pesanan
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            pesan: 'Gagal mengambil data pesanan pelanggan'
        });
    }
});

module.exports = router; 