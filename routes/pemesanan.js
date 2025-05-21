const express = require('express');
const router = express.Router();
const Model_Pemesanan = require('../model/Model_Pemesanan');
const { createLogTransaksi } = require('../helpers/logHelper');

router.put('/update-status/:id', async (req, res) => {
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