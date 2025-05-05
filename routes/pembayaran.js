const express = require('express');
const Model_Pembayaran = require('../model/Model_Pembayaran');
const router = express.Router();

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

// POST - Membuat pembayaran baru
router.post('/store', async (req, res) => {
  try {
    const { id_pemesanan, jumlah, metode, tanggal_pembayaran } = req.body;
    
    // Validasi input
    if (!id_pemesanan || !jumlah || !metode || !tanggal_pembayaran) {
      return res.status(400).json({
        status: false,
        message: 'Semua field diperlukan'
      });
    }
    
    const pembayaranData = {
      id_pemesanan,
      jumlah,
      metode,
      tanggal_pembayaran
    };
    
    // Simpan pembayaran
    const result = await Model_Pembayaran.store(pembayaranData);
    const idPembayaran = result.insertId;
    
    res.status(201).json({
      status: true,
      message: 'Pembayaran berhasil dibuat',
      id_pembayaran: idPembayaran
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