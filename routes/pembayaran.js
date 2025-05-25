const express = require('express');
const Model_Pembayaran = require('../model/Model_Pembayaran');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder upload ada
const uploadDir = 'public/uploads/pembayaran';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedExt = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExt.includes(ext)) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// GET - Mendapatkan semua pembayaran
router.get('/', async (req, res) => {
  try {
    const pembayaran = await Model_Pembayaran.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Pembayaran berhasil diambil',
      data: pembayaran
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data pembayaran',
      error: error.message
    });
  }
});

// GET - Mendapatkan pembayaran berdasarkan ID pemesanan
router.get('/pemesanan/:id', async (req, res) => {
  try {
    const idPemesanan = req.params.id;
    const pembayaran = await Model_Pembayaran.getByPemesanan(idPemesanan);
    
    res.status(200).json({
      status: true,
      message: 'Data pembayaran berhasil diambil',
      data: pembayaran
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data pembayaran',
      error: error.message
    });
  }
});

// GET - Mendapatkan pembayaran berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pembayaran = await Model_Pembayaran.getId(id);
    
    if (!pembayaran || pembayaran.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail pembayaran berhasil diambil',
      data: pembayaran[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail pembayaran',
      error: error.message
    });
  }
});

// GET - Riwayat pembayaran berdasarkan id_user
router.get('/user/:id_user', async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const pembayaran = await Model_Pembayaran.getByUserId(id_user);
    res.status(200).json({
      status: true,
      message: 'Riwayat pembayaran berhasil diambil',
      data: pembayaran
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil riwayat pembayaran',
      error: error.message
    });
  }
});

// GET - Feedback dan riwayat pembayaran user
router.get('/user/:id_user/riwayat-feedback', async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const Model_Feedback = require('../model/Model_Feedback');
    const feedback = await Model_Feedback.getByUserId(id_user);
    const pembayaran = await Model_Pembayaran.getByUserId(id_user);

    res.status(200).json({
      status: true,
      message: 'Data feedback dan riwayat pembayaran berhasil diambil',
      data: {
        feedback,
        pembayaran
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data',
      error: error.message
    });
  }
});

// POST - Membuat pembayaran baru
router.post('/store', upload.single('bukti_pembayaran'), async (req, res) => {
  try {
    const { id_pemesanan, jumlah, metode, tanggal_pembayaran } = req.body;
    
    // Validasi input
    if (!id_pemesanan || !jumlah || !metode || !tanggal_pembayaran || !req.file) {
      return res.status(400).json({
        status: false,
        message: 'Semua field diperlukan termasuk bukti pembayaran'
      });
    }
    
    const pembayaranData = {
      id_pemesanan,
      jumlah,
      metode,
      tanggal_pembayaran,
      bukti_pembayaran: req.file.filename
    };
    
    // Simpan pembayaran
    const result = await Model_Pembayaran.store(pembayaranData);
    const idPembayaran = result.insertId;

    // Tambahkan ke bukti_transfer
    const Model_BuktiTransfer = require('../model/Model_BuktiTransfer');
    await Model_BuktiTransfer.store({
      id_pembayaran: idPembayaran,
      gambar_bukti: req.file.filename,
      tanggal_upload: new Date(),
      status_verifikasi: 'pending'
    });

    // Update status pesanan menjadi 'menunggu konfirmasi'
    const Model_Pesanan = require('../model/Model_Pesanan');
    await Model_Pesanan.updateStatus(id_pemesanan, 'menunggu konfirmasi');
    
    res.status(201).json({
      status: true,
      message: 'Pembayaran berhasil dibuat',
      id_pembayaran: idPembayaran,
      bukti_pembayaran: req.file.filename
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal membuat pembayaran',
      error: error.message
    });
  }
});

// PATCH - Mengupdate pembayaran
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { jumlah, metode, tanggal_pembayaran } = req.body;
    
    // Cek apakah pembayaran ada
    const pembayaranData = await Model_Pembayaran.getId(id);
    if (!pembayaranData || pembayaranData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    
    // Data untuk update pembayaran
    const data = {};
    if (jumlah) data.jumlah = jumlah;
    if (metode) data.metode = metode;
    if (tanggal_pembayaran) data.tanggal_pembayaran = tanggal_pembayaran;
    
    await Model_Pembayaran.update(id, data);
    
    res.status(200).json({
      status: true,
      message: 'Pembayaran berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui pembayaran',
      error: error.message
    });
  }
});

// DELETE - Menghapus pembayaran
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Cek apakah pembayaran ada
    const pembayaranData = await Model_Pembayaran.getId(id);
    if (!pembayaranData || pembayaranData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pembayaran tidak ditemukan'
      });
    }
    
    // Hapus pembayaran
    await Model_Pembayaran.delete(id);
    
    res.status(200).json({
      status: true,
      message: 'Pembayaran berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus pembayaran',
      error: error.message
    });
  }
});

module.exports = router; 