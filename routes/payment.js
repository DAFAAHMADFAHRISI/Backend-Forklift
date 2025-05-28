const express = require('express');
const router = express.Router();
const snap = require('../config/midtrans');
const Model_Pembayaran = require('../model/Model_Pembayaran');
const Model_Pesanan = require('../model/Model_Pesanan');
const { verifyToken, checkPesananOwnership, userOnly } = require('../middleware/authMiddleware');

// Middleware untuk semua route payment
router.use(verifyToken, userOnly);

// Create transaction
router.post('/create-transaction', async (req, res) => {
    try {
        const { id_pemesanan, jumlah, metode } = req.body;
        const id_user = req.user.id_user; // dari JWT

        // Validasi input
        if (!id_pemesanan || !jumlah || !metode) {
            return res.status(400).json({
                status: false,
                message: 'Semua field diperlukan'
            });
        }

        // Ambil data pesanan dari database
        const pesanan = await Model_Pesanan.getId(id_pemesanan);
        if (!pesanan) {
            return res.status(404).json({
                status: false,
                message: 'Pesanan tidak ditemukan'
            });
        }
        if (pesanan.id_user !== id_user) {
            return res.status(403).json({
                status: false,
                message: 'Access denied. You can only access your own orders.'
            });
        }

        // Generate order ID
        const orderId = "ORDER-" + Math.random().toString(36).substring(7);

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: jumlah
            },
            customer_details: {
                first_name: req.body.first_name || "Customer",
                last_name: req.body.last_name || "",
                email: req.body.email || "customer@example.com",
                phone: req.body.phone || "08123456789"
            },
            item_details: [{
                id: "ITEM-1",
                price: jumlah,
                quantity: 1,
                name: "Pembayaran Pemesanan"
            }]
        };

        const transaction = await snap.createTransaction(parameter);
        
        // Simpan data pembayaran ke database
        const pembayaranData = {
            id_pemesanan,
            jumlah,
            metode: 'midtrans',
            tanggal_pembayaran: new Date(),
            order_id: orderId,
            status: 'pending'
        };
        
        const result = await Model_Pembayaran.store(pembayaranData);
        
        res.status(200).json({
            status: true,
            message: 'Transaksi berhasil dibuat',
            data: {
                ...transaction,
                id_pembayaran: result.insertId
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Gagal membuat transaksi',
            error: error.message
        });
    }
});

// Handle notification from Midtrans
router.post('/notification', async (req, res) => {
    try {
        console.log('Notifikasi Midtrans masuk:', req.body); // Log notifikasi masuk
        let statusResponse;
        // Jika ada field simulate, gunakan payload langsung (untuk testing manual)
        if (req.body.simulate) {
            statusResponse = req.body;
        } else {
            // Proses normal: verifikasi ke Midtrans
            statusResponse = await snap.transaction.notification(req.body);
        }

        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        // Update status pembayaran di database
        let status = 'pending';
        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                status = 'challenge';
            } else if (fraudStatus == 'accept') {
                status = 'success';
            }
        } else if (transactionStatus == 'settlement') {
            status = 'success';
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            status = 'failed';
        }

        // Update status pembayaran
        await Model_Pembayaran.updateByOrderId(orderId, { status });

        // Jika pembayaran sukses, update status pesanan menjadi 'menunggu konfirmasi'
        if (status === 'success') {
            const pembayaran = await Model_Pembayaran.getByOrderId(orderId);
            if (pembayaran) {
                await Model_Pesanan.updateStatus(pembayaran.id_pemesanan, 'menunggu konfirmasi');
                console.log('Status pesanan', pembayaran.id_pemesanan, 'berhasil diupdate ke: menunggu konfirmasi');
            } else {
                console.log('Pembayaran tidak ditemukan untuk order_id:', orderId);
            }
        }

        res.status(200).json({ 
            status: true,
            message: 'Notification processed successfully'
        });
    } catch (error) {
        console.error('Error saat memproses notifikasi Midtrans:', error);
        res.status(500).json({
            status: false,
            message: 'Gagal memproses notifikasi',
            error: error.message
        });
    }
});

module.exports = router; 