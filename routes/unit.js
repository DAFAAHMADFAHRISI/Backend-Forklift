const express = require('express');
const Model_Unit = require('../model/Model_Unit');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken, adminOnly, userOnly } = require('../middleware/authMiddleware');

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

// Public route - Semua orang bisa lihat unit yang tersedia
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

// GET - Mendapatkan unit yang tersedia (untuk user)
router.get('/available', async (req, res) => {
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

// GET - Mendapatkan unit berdasarkan ID
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

// Protected route - Hanya admin yang bisa tambah unit
router.post('/store', verifyToken, adminOnly, upload.single('gambar'), async (req, res) => {
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

// Protected route - Hanya admin yang bisa update unit
router.put('/:id', verifyToken, adminOnly, async (req, res) => {
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

// Protected route - Hanya admin yang bisa hapus unit
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
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
router.put('/edit/:id', verifyToken, adminOnly, upload.single('gambar'), async (req, res) => {
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

module.exports = router; 