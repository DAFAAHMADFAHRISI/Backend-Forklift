/**
 * Routes Bukti Transfer
 * Menangani semua endpoint terkait bukti transfer pembayaran, termasuk:
 * - Upload bukti transfer
 * - Verifikasi bukti transfer
 * - Pengambilan data bukti transfer
 * - Pengelolaan status verifikasi
 */

const express = require('express');
const Model_BuktiTransfer = require('../model/Model_BuktiTransfer');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken, userOnly, adminOnly } = require('../middleware/authMiddleware');
const Model_Pembayaran = require('../model/Model_Pembayaran');
const { createLogTransaksi } = require('../helpers/logHelper');

// Konfigurasi upload bukti transfer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/bukti_transfer'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPEG, JPG, PNG, dan PDF yang diperbolehkan'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Middleware untuk memastikan user sudah login
router.use(verifyToken);

/**
 * GET /bukti-transfer
 * Mengambil semua data bukti transfer milik user yang sedang login
 */
router.get('/', async (req, res) => {
  try {
    const buktiTransfer = await Model_BuktiTransfer.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Bukti Transfer berhasil diambil',
      data: buktiTransfer
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data bukti transfer',
      error: error.message
    });
  }
});

// GET - Mendapatkan bukti transfer berdasarkan ID pembayaran
router.get('/pembayaran/:id', async (req, res) => {
  try {
    const idPembayaran = req.params.id;
    const buktiTransfer = await Model_BuktiTransfer.getByPembayaran(idPembayaran);
    
    res.status(200).json({
      status: true,
      message: 'Data bukti transfer berhasil diambil',
      data: buktiTransfer
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data bukti transfer',
      error: error.message
    });
  }
});

/**
 * GET /bukti-transfer/:id
 * Mengambil detail bukti transfer berdasarkan ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const buktiTransfer = await Model_BuktiTransfer.getId(id);
    
    if (!buktiTransfer || buktiTransfer.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Bukti transfer tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail bukti transfer berhasil diambil',
      data: buktiTransfer[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail bukti transfer',
      error: error.message
    });
  }
});

/**
 * POST /bukti-transfer
 * Upload bukti transfer baru
 * Body harus berisi: id_pembayaran, file bukti transfer
 */
router.post('/store', userOnly, upload.fields([
  { name: 'file_bukti', maxCount: 1 },
  { name: 'gambar_bukti', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id_pembayaran, status_verifikasi } = req.body;
    
    // Validasi input
    if (!id_pembayaran || !req.files) {
      return res.status(400).json({
        status: false,
        message: 'ID pembayaran dan minimal satu file bukti diperlukan'
      });
    }
    
    const data = {
      id_pembayaran,
      file_bukti: req.files.file_bukti ? req.files.file_bukti[0].filename : null,
      gambar_bukti: req.files.gambar_bukti ? req.files.gambar_bukti[0].filename : null,
      status_verifikasi: status_verifikasi || 'menunggu'
    };
    
    await Model_BuktiTransfer.store(data);
    res.status(201).json({
      status: true,
      message: 'Bukti transfer berhasil ditambahkan'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menambahkan bukti transfer',
      error: error.message
    });
  }
});

/**
 * PUT /bukti-transfer/:id/verifikasi
 * Verifikasi bukti transfer (admin only)
 * Body harus berisi: status_verifikasi
 */
router.put('/:id/verifikasi', adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const { status_verifikasi } = req.body;
    
    if (!status_verifikasi) {
      return res.status(400).json({
        status: false,
        message: 'Status verifikasi diperlukan'
      });
    }
    
    // Cek apakah bukti transfer ada
    const buktiTransferData = await Model_BuktiTransfer.getId(id);
    if (!buktiTransferData || buktiTransferData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Bukti transfer tidak ditemukan'
      });
    }
    
    await Model_BuktiTransfer.updateStatus(id, status_verifikasi);
    res.status(200).json({
      status: true,
      message: 'Status verifikasi berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui status verifikasi',
      error: error.message
    });
  }
});

/**
 * DELETE /bukti-transfer/:id
 * Menghapus bukti transfer
 * Hanya bisa dilakukan jika status masih 'menunggu_verifikasi'
 */
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Cek apakah bukti transfer ada
    const buktiTransferData = await Model_BuktiTransfer.getId(id);
    if (!buktiTransferData || buktiTransferData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Bukti transfer tidak ditemukan'
      });
    }
    
    // Hapus file jika ada
    const bukti = buktiTransferData[0];
    if (bukti.file_bukti) {
      const filePath = path.join(__dirname, '../public/bukti_transfer/', bukti.file_bukti);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (bukti.gambar_bukti) {
      const imagePath = path.join(__dirname, '../public/bukti_transfer/', bukti.gambar_bukti);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Model_BuktiTransfer.delete(id);
    res.status(200).json({
      status: true,
      message: 'Bukti transfer berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus bukti transfer',
      error: error.message
    });
  }
});

module.exports = router; 