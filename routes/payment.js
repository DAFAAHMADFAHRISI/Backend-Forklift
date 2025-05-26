const express = require('express');
const router = express.Router();
const snap = require('../config/midtrans');
const Model_Pembayaran = require('../model/Model_Pembayaran');
const Model_Pesanan = require('../model/Model_Pesanan');

// Create transaction
router.post('/create-transaction', async (req, res) => {
    try {
        const { id_pemesanan, jumlah, metode } = req.body;

        // Validasi input
        if (!id_pemesanan || !jumlah || !metode) {
            return res.status(400).json({
                status: false,
                message: 'Semua field diperlukan'
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
        const notification = req.body;
        
        // Verify signature
        const statusResponse = await snap.transaction.notification(notification);
        
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

        // Jika pembayaran sukses, update status pesanan
        if (status === 'success') {
            const pembayaran = await Model_Pembayaran.getByOrderId(orderId);
            if (pembayaran) {
                await Model_Pesanan.updateStatus(pembayaran.id_pemesanan, 'menunggu konfirmasi');
            }
        }

        res.status(200).json({ 
            status: true,
            message: 'Notification processed successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Gagal memproses notifikasi',
            error: error.message
        });
    }
});

module.exports = router; 