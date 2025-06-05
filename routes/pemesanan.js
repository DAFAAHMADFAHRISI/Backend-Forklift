const express = require('express');
const router = express.Router();
const Model_Pemesanan = require('../model/Model_Pemesanan');
const Model_Unit = require('../model/Model_Unit');
const { createLogTransaksi } = require('../helpers/logHelper');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');

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