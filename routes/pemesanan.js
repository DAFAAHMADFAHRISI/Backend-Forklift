/**
 * Routes Pemesanan
 * Menangani semua endpoint terkait pemesanan forklift, termasuk:
 * - Pembuatan pemesanan baru
 * - Pengelolaan status pemesanan
 * - Pengambilan data pemesanan
 * - Pembatalan pemesanan
 */

const express = require('express');
const router = express.Router();
const Model_Pemesanan = require('../model/Model_Pemesanan');
const Model_Unit = require('../model/Model_Unit');
const { createLogTransaksi } = require('../helpers/logHelper');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

// Middleware untuk memastikan user sudah login
router.use(verifyToken);

/**
 * GET /pemesanan
 * Mengambil semua data pemesanan milik user yang sedang login
 */
router.get('/', async (req, res) => {
    // ... existing code ...
});

/**
 * POST /pemesanan
 * Membuat pemesanan baru
 * Body harus berisi: id_unit, tanggal_mulai, tanggal_selesai, lokasi
 */
router.post('/', async (req, res) => {
    // ... existing code ...
});

/**
 * GET /pemesanan/:id
 * Mengambil detail pemesanan berdasarkan ID
 */
router.get('/:id', async (req, res) => {
    // ... existing code ...
});

/**
 * PUT /pemesanan/:id/status
 * Mengupdate status pemesanan
 * Status yang tersedia: menunggu_pembayaran, menunggu_konfirmasi, dikirim, selesai, dibatalkan
 */
router.put('/:id/status', async (req, res) => {
    // ... existing code ...
});

/**
 * DELETE /pemesanan/:id
 * Membatalkan pemesanan
 * Hanya bisa dilakukan jika status masih 'menunggu_pembayaran'
 */
router.delete('/:id', async (req, res) => {
    // ... existing code ...
});

router.put('/update-status/:id', verifyToken, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const idPemesanan = req.params.id;
        
        // Validasi status
        const validStatus = ['menunggu pembayaran', 'menunggu konfirmasi', 'dikirim', 'selesai'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                status: false,
                message: 'Status tidak valid'
            });
        }

        // Update status di database
        await Model_Pemesanan.updateStatus(idPemesanan, status);

        // Jika status selesai, update status unit menjadi tersedia
        if (status === 'selesai') {
            // Ambil data pesanan untuk dapatkan id_unit
            const pesanan = await Model_Pemesanan.getId(idPemesanan);
            if (pesanan && pesanan.id_unit) {
                await Model_Unit.updateStatus(pesanan.id_unit, 'tersedia');
            }
        }
        
        // Buat log transaksi otomatis
        await createLogTransaksi(
            idPemesanan,
            `status_${status}`,
            `Status pemesanan berubah menjadi ${status}`
        );
        
        res.status(200).json({
            status: true,
            message: 'Status pemesanan berhasil diupdate'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Gagal mengupdate status pemesanan',
            error: error.message
        });
    }
});

module.exports = router;