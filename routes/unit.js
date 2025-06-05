/**
 * Routes Unit Forklift
 * Menangani semua endpoint terkait unit forklift, termasuk:
 * - Pengelolaan data unit
 * - Pengecekan ketersediaan unit
 * - Pengambilan data unit
 * - Pengelolaan status unit
 */

const express = require('express');
const Model_Unit = require('../model/Model_Unit');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken, adminOnly, userOnly } = require('../middleware/authMiddleware');
const Model_Pesanan = require('../model/Model_Pesanan');
const { createLogTransaksi } = require('../helpers/logHelper');

// Konfigurasi upload gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file JPEG, JPG, dan PNG yang diperbolehkan'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Middleware untuk memastikan user sudah login
router.use(verifyToken);

/**
 * GET /unit
 * Mengambil semua data unit forklift
 */
router.get('/', async (req, res) => {
    try {
        const units = await Model_Unit.getAll();
        res.json({
            status: true,
            message: 'List semua unit forklift',
            data: units
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

/**
 * GET /unit/tersedia
 * Mengambil daftar unit yang tersedia (tidak sedang disewa)
 */
router.get('/tersedia', async (req, res) => {
  try {
    const units = await Model_Unit.getAvailable();
    res.status(200).json({
      status: true,
      message: 'Data Unit tersedia berhasil diambil',
      data: units
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data unit tersedia',
      error: error.message
    });
  }
});

/**
 * GET /unit/:id
 * Mengambil detail unit berdasarkan ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const unit = await Model_Unit.getId(id);
    
    if (!unit || unit.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Unit tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail unit berhasil diambil',
      data: unit[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail unit',
      error: error.message
    });
  }
});

/**
 * POST /unit
 * Membuat data unit baru (admin only)
 * Body harus berisi: nama_unit, jenis, kapasitas, status
 */
router.post('/store', adminOnly, upload.single('gambar'), async (req, res) => {
    try {
        // Validasi harga_per_jam
        if (req.body.harga_per_jam) {
            const harga = parseFloat(req.body.harga_per_jam);
            if (isNaN(harga) || harga < 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Harga per jam harus berupa angka positif'
                });
            }
        }

        // Validasi kapasitas
        const validKapasitas = ['2.5', '3', '5', '7', '10'];
        if (!validKapasitas.includes(req.body.kapasitas)) {
            return res.status(400).json({
                status: false,
                message: 'Kapasitas harus salah satu dari: 2.5, 3, 5, 7, 10'
            });
        }

        // req.file untuk gambar, req.body untuk data lain
        const dataUnit = {
            ...req.body,
            gambar: req.file ? req.file.filename : null,
            harga_per_jam: req.body.harga_per_jam || 300000.00,
            status: 'tersedia' // Default status untuk unit baru
        };
        const result = await Model_Unit.store(dataUnit);
        res.json({
            status: true,
            message: 'Berhasil menambah unit forklift',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

/**
 * PUT /unit/:id
 * Mengupdate data unit (admin only)
 * Body berisi field yang akan diupdate
 */
router.put('/:id', adminOnly, async (req, res) => {
    try {
        // Validasi harga_per_jam
        if (req.body.harga_per_jam) {
            const harga = parseFloat(req.body.harga_per_jam);
            if (isNaN(harga) || harga < 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Harga per jam harus berupa angka positif'
                });
            }
        }

        // Validasi kapasitas
        if (req.body.kapasitas) {
            const validKapasitas = ['2.5', '3', '5', '7', '10'];
            if (!validKapasitas.includes(req.body.kapasitas)) {
                return res.status(400).json({
                    status: false,
                    message: 'Kapasitas harus salah satu dari: 2.5, 3, 5, 7, 10'
                });
            }
        }

        // Validasi status
        if (req.body.status) {
            const validStatus = ['tersedia', 'disewa'];
            if (!validStatus.includes(req.body.status)) {
                return res.status(400).json({
                    status: false,
                    message: 'Status harus salah satu dari: tersedia, disewa'
                });
            }
        }

        const result = await Model_Unit.update(req.params.id, req.body);
        res.json({
            status: true,
            message: 'Berhasil mengupdate unit forklift',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

/**
 * DELETE /unit/:id
 * Menghapus data unit (admin only)
 * Hanya bisa dilakukan jika unit tidak sedang disewa
 */
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        // Cek apakah unit sedang disewa
        const unit = await Model_Unit.getId(req.params.id);
        if (unit && unit[0].status === 'disewa') {
            return res.status(400).json({
                status: false,
                message: 'Tidak dapat menghapus unit yang sedang disewa'
            });
        }

        const result = await Model_Unit.delete(req.params.id);
        res.json({
            status: true,
            message: 'Berhasil menghapus unit forklift',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

// Edit unit (update data dan gambar)
router.put('/edit/:id', adminOnly, upload.single('gambar'), async (req, res) => {
    try {
        // Validasi harga_per_jam
        if (req.body.harga_per_jam) {
            const harga = parseFloat(req.body.harga_per_jam);
            if (isNaN(harga) || harga < 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Harga per jam harus berupa angka positif'
                });
            }
        }

        // Validasi kapasitas
        if (req.body.kapasitas) {
            const validKapasitas = ['2.5', '3', '5', '7', '10'];
            if (!validKapasitas.includes(req.body.kapasitas)) {
                return res.status(400).json({
                    status: false,
                    message: 'Kapasitas harus salah satu dari: 2.5, 3, 5, 7, 10'
                });
            }
        }

        // Siapkan data yang akan diupdate
        const dataUpdate = { ...req.body };
        if (req.file) {
            // Hapus gambar lama jika ada
            const oldUnit = await Model_Unit.getId(req.params.id);
            if (oldUnit && oldUnit[0].gambar) {
                const oldImagePath = path.join('public/images', oldUnit[0].gambar);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            dataUpdate.gambar = req.file.filename;
        }
        const result = await Model_Unit.update(req.params.id, dataUpdate);
        res.json({
            status: true,
            message: 'Berhasil mengupdate unit forklift',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

// PATCH - Update status unit
router.patch('/status/:id', adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatus = ['tersedia', 'disewa'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                status: false,
                message: 'Status harus salah satu dari: tersedia, disewa'
            });
        }
        const result = await Model_Unit.update(req.params.id, { status });
        res.json({
            status: true,
            message: 'Berhasil mengupdate status unit forklift',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

/**
 * GET /unit/cek-ketersediaan
 * Mengecek ketersediaan unit pada rentang waktu tertentu
 * Query params: tanggal_mulai, tanggal_selesai
 */
router.get('/cek-ketersediaan', async (req, res) => {
    // ... existing code ...
});

module.exports = router; 