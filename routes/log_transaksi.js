/**
 * Routes Log Transaksi
 * Menangani semua endpoint terkait log transaksi, termasuk:
 * - Pencatatan aktivitas transaksi
 * - Pengambilan riwayat transaksi
 * - Pelacakan perubahan status
 * - Analisis aktivitas sistem
 */

const express = require('express');
const Model_LogTransaksi = require('../model/Model_LogTransaksi');
const router = express.Router();
const { verifyToken, adminOnly, userOnly } = require('../middleware/authMiddleware');
const Model_Pesanan = require('../model/Model_Pesanan');

// Middleware untuk memastikan user sudah login dan admin
router.use(verifyToken, adminOnly);

// GET - Mendapatkan semua log transaksi
router.get('/', async (req, res) => {
  try {
    const logs = await Model_LogTransaksi.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Log Transaksi berhasil diambil',
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data log transaksi',
      error: error.message
    });
  }
});

// GET - Mendapatkan log transaksi berdasarkan ID pemesanan
router.get('/pemesanan/:id', async (req, res) => {
  try {
    const idPemesanan = req.params.id;
    const logs = await Model_LogTransaksi.getByPemesanan(idPemesanan);
    
    res.status(200).json({
      status: true,
      message: 'Data log transaksi berhasil diambil',
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data log transaksi',
      error: error.message
    });
  }
});

// GET - Mendapatkan log transaksi berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const log = await Model_LogTransaksi.getId(id);
    
    if (!log) {
      return res.status(404).json({
        status: false,
        message: 'Log transaksi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail log transaksi berhasil diambil',
      data: log
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail log transaksi',
      error: error.message
    });
  }
});

// POST - Menambahkan log transaksi baru
router.post('/store', async (req, res) => {
  try {
    const { id_pemesanan, status_transaksi, keterangan } = req.body;
    
    // Validasi input
    if (!id_pemesanan || !status_transaksi) {
      return res.status(400).json({
        status: false,
        message: 'ID pemesanan dan status transaksi diperlukan'
      });
    }
    
    const logData = {
      id_pemesanan,
      status_transaksi,
      keterangan,
      waktu: new Date()
    };
    
    await Model_LogTransaksi.store(logData);
    res.status(201).json({
      status: true,
      message: 'Log transaksi berhasil ditambahkan'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menambahkan log transaksi',
      error: error.message
    });
  }
});

// DELETE - Menghapus log transaksi (Admin only)
router.delete('/delete/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const logData = await Model_LogTransaksi.getId(id);
    console.log('DEBUG id:', id);
    console.log('DEBUG logData:', logData);
    if (!logData) {
      return res.status(404).json({
        status: false,
        message: 'Log transaksi tidak ditemukan'
      });
    }
    await Model_LogTransaksi.Delete(id);
    res.status(200).json({
      status: true,
      message: 'Log transaksi berhasil dihapus'
    });
  } catch (error) {
    console.log('DEBUG error:', error);
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus log transaksi',
      error: error.message
    });
  }
});

// Example route for admin-only access
router.get('/admin/users', verifyToken, adminOnly, (req, res) => {
    // Handle admin-only user management
});

router.get('/admin/units', verifyToken, adminOnly, (req, res) => {
    // Handle admin-only unit management
});

router.get('/admin/operators', verifyToken, adminOnly, (req, res) => {
    // Handle admin-only operator management
});

router.get('/admin/pesanan', verifyToken, adminOnly, (req, res) => {
    // Handle admin-only order management
});

router.get('/admin/pembayaran', verifyToken, adminOnly, (req, res) => {
    // Handle admin-only payment management
});

router.get('/admin/transaksi', verifyToken, adminOnly, (req, res) => {
    // Handle admin-only transaction management
});

module.exports = router; 