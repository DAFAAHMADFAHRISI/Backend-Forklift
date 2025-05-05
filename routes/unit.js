const express = require('express');
const Model_Unit = require('../model/Model_Unit');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
//done
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

// GET - Mendapatkan semua unit
router.get('/', async (req, res) => {
  try {
    const units = await Model_Unit.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Unit berhasil diambil',
      data: units
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data unit',
      error: error.message
    });
  }
});

// GET - Mendapatkan unit yang tersedia
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

// POST - Menambahkan unit baru
router.post('/store', upload.single('gambar'), async (req, res) => {
  try {
    const { nama_unit, kapasitas, status } = req.body;
    
    const data = {
      nama_unit,
      kapasitas,
      status: status || 'tersedia',
      gambar: req.file ? req.file.filename : null
    };
    
    await Model_Unit.store(data);
    res.status(201).json({
      status: true,
      message: 'Unit berhasil ditambahkan'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menambahkan unit',
      error: error.message
    });
  }
});

// PATCH - Mengupdate unit
router.patch('/update/:id', upload.single('gambar'), async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_unit, kapasitas, status } = req.body;
    
    // Cek apakah unit ada
    const unitData = await Model_Unit.getId(id);
    if (!unitData || unitData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Unit tidak ditemukan'
      });
    }
    
    const oldUnit = unitData[0];
    
    // Data untuk update
    const data = {};
    if (nama_unit) data.nama_unit = nama_unit;
    if (kapasitas) data.kapasitas = kapasitas;
    if (status) data.status = status;
    
    // Update gambar jika ada
    if (req.file) {
      data.gambar = req.file.filename;
      
      // Hapus gambar lama jika ada
      if (oldUnit.gambar) {
        const oldFilePath = path.join(__dirname, '../public/images/', oldUnit.gambar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }
    
    await Model_Unit.update(id, data);
    res.status(200).json({
      status: true,
      message: 'Unit berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui unit',
      error: error.message
    });
  }
});

// PATCH - Update status unit
router.patch('/status/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        status: false,
        message: 'Status diperlukan'
      });
    }
    
    // Cek apakah unit ada
    const unitData = await Model_Unit.getId(id);
    if (!unitData || unitData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Unit tidak ditemukan'
      });
    }
    
    await Model_Unit.updateStatus(id, status);
    res.status(200).json({
      status: true,
      message: 'Status unit berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui status unit',
      error: error.message
    });
  }
});

// DELETE - Menghapus unit
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Cek apakah unit ada
    const unitData = await Model_Unit.getId(id);
    if (!unitData || unitData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Unit tidak ditemukan'
      });
    }
    
    // Hapus gambar jika ada
    if (unitData[0].gambar) {
      const filePath = path.join(__dirname, '../public/images/', unitData[0].gambar);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Model_Unit.delete(id);
    res.status(200).json({
      status: true,
      message: 'Unit berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus unit',
      error: error.message
    });
  }
});

module.exports = router; 