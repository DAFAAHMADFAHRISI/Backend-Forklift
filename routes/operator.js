/**
 * Routes Operator
 * Menangani semua endpoint terkait operator forklift, termasuk:
 * - Pengelolaan data operator
 * - Penugasan operator
 * - Pengambilan data operator
 * - Pengelolaan jadwal operator
 */

const express = require('express');
const Model_Operator = require('../model/Model_Operator');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Model_Pesanan = require('../model/Model_Pesanan');
const { createLogTransaksi } = require('../helpers/logHelper');

// Konfigurasi folder upload
const uploadDir = 'public/uploads/operator';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware untuk memastikan user sudah login dan admin
router.use(verifyToken, adminOnly);

/**
 * GET /operator
 * Mengambil semua data operator
 */
router.get('/', async (req, res) => {
  try {
    const operators = await Model_Operator.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Operator berhasil diambil',
      data: operators
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data operator',
      error: error.message
    });
  }
});

/**
 * GET /operator/tersedia
 * Mengambil daftar operator yang tersedia (tidak sedang bertugas)
 */
router.get('/available', verifyToken, async (req, res) => {
  try {
    const operators = await Model_Operator.getAvailable();
    res.status(200).json({
      status: true,
      message: 'Data Operator tersedia berhasil diambil',
      data: operators
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data operator tersedia',
      error: error.message
    });
  }
});

/**
 * GET /operator/:id
 * Mengambil detail operator berdasarkan ID
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const operator = await Model_Operator.getId(id);

    if (!operator) {
      return res.status(404).json({
        status: false,
        message: 'Operator tidak ditemukan'
      });
    }

    res.status(200).json({
      status: true,
      message: 'Detail operator berhasil diambil',
      data: operator // <-- PENTING!
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail operator',
      error: error.message
    });
  }
});

/**
 * POST /operator
 * Membuat data operator baru
 * Body harus berisi: nama, no_hp, alamat, status
 */
router.post('/store', verifyToken, adminOnly, upload.single('foto'), async (req, res) => {
  try {
    const { nama_operator, no_hp, status } = req.body;
    const foto = req.file ? req.file.filename : null;
    const data = {
      nama_operator,
      foto, // simpan nama file gambar
      no_hp,
      status: status || 'tersedia'
    };
    await Model_Operator.store(data);
    res.status(201).json({
      status: true,
      message: 'Operator berhasil ditambahkan'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menambahkan operator',
      error: error.message
    });
  }
});

/**
 * PUT /operator/:id
 * Mengupdate data operator
 * Body berisi field yang akan diupdate
 */
router.patch('/update/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_operator, no_hp, status } = req.body;
    const operatorData = await Model_Operator.getId(id);
    if (!operatorData || operatorData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Operator tidak ditemukan'
      });
    }
    const data = {};
    if (nama_operator) data.nama_operator = nama_operator;
    if (no_hp) data.no_hp = no_hp;
    if (status) data.status = status;
    await Model_Operator.update(id, data);
    res.status(200).json({
      status: true,
      message: 'Operator berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui operator',
      error: error.message
    });
  }
});

/**
 * PATCH /operator/status/:id
 * Mengupdate status operator
 * Body berisi status baru
 */
router.patch('/status/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        status: false,
        message: 'Status diperlukan'
      });
    }
    const operatorData = await Model_Operator.getId(id);
    if (!operatorData || operatorData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Operator tidak ditemukan'
      });
    }
    await Model_Operator.update(id, { status });
    res.status(200).json({
      status: true,
      message: 'Status operator berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui status operator',
      error: error.message
    });
  }
});

// DELETE - Menghapus operator (admin only)
router.delete('/delete/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const operatorData = await Model_Operator.getId(id);
    if (!operatorData || operatorData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Operator tidak ditemukan'
      });
    }
    await Model_Operator.delete(id);
    res.status(200).json({
      status: true,
      message: 'Operator berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus operator',
      error: error.message
    });
  }
});

// PUT - Edit operator (admin only)
router.put('/edit/:id', verifyToken, adminOnly, upload.single('foto'), async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_operator, no_hp, status } = req.body;
    const operatorData = await Model_Operator.getId(id);
    if (!operatorData || operatorData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Operator tidak ditemukan'
      });
    }
    const data = {};
    if (nama_operator) data.nama_operator = nama_operator;
    if (no_hp) data.no_hp = no_hp;
    if (status) data.status = status;
    if (req.file) data.foto = req.file.filename;
    await Model_Operator.update(id, data);
    res.status(200).json({
      status: true,
      message: 'Operator berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui operator',
      error: error.message
    });
  }
});

module.exports = router;