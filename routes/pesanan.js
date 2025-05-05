const express = require('express');
const Model_Pesanan = require('../model/Model_Pesanan');
const router = express.Router();

// GET - Mendapatkan semua pesanan
router.get('/', async (req, res) => {
  try {
    const pesanan = await Model_Pesanan.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Pesanan berhasil diambil',
      data: pesanan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data pesanan',
      error: error.message
    });
  }
});

// GET - Mendapatkan pesanan berdasarkan ID pelanggan
router.get('/pelanggan/:id', async (req, res) => {
  try {
    const idPelanggan = req.params.id;
    const pesanan = await Model_Pesanan.getByPelanggan(idPelanggan);
    
    res.status(200).json({
      status: true,
      message: 'Data pesanan pelanggan berhasil diambil',
      data: pesanan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data pesanan pelanggan',
      error: error.message
    });
  }
});

// GET - Mendapatkan pesanan berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pesanan = await Model_Pesanan.getId(id);
    
    if (!pesanan || pesanan.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail pesanan berhasil diambil',
      data: pesanan[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail pesanan',
      error: error.message
    });
  }
});

// POST - Membuat pesanan baru
router.post('/store', async (req, res) => {
  try {
    const { id_pelanggan, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan, status } = req.body;
    
    // Validasi input
    if (!id_pelanggan || !id_unit || !tanggal_mulai || !tanggal_selesai || !lokasi_pengiriman) {
      return res.status(400).json({
        status: false,
        message: 'Semua field diperlukan'
      });
    }
    
    const pesananData = {
      id_pelanggan,
      id_unit,
      id_operator,
      tanggal_mulai,
      tanggal_selesai,
      lokasi_pengiriman,
      nama_perusahaan,
      status: status || 'menunggu pembayaran'
    };
    
    // Simpan pesanan
    const result = await Model_Pesanan.store(pesananData);
    const idPemesanan = result.insertId;
    
    res.status(201).json({
      status: true,
      message: 'Pesanan berhasil dibuat',
      id_pemesanan: idPemesanan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal membuat pesanan',
      error: error.message
    });
  }
});

// PATCH - Mengupdate status pesanan
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
    
    // Cek apakah pesanan ada
    const pesananData = await Model_Pesanan.getId(id);
    if (!pesananData || pesananData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    
    await Model_Pesanan.updateStatus(id, status);
    res.status(200).json({
      status: true,
      message: 'Status pesanan berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui status pesanan',
      error: error.message
    });
  }
});

// PATCH - Mengupdate pesanan
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { id_pelanggan, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan, status } = req.body;
    
    // Cek apakah pesanan ada
    const pesananData = await Model_Pesanan.getId(id);
    if (!pesananData || pesananData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    
    // Data untuk update pesanan
    const data = {};
    if (id_pelanggan) data.id_pelanggan = id_pelanggan;
    if (id_unit) data.id_unit = id_unit;
    if (id_operator) data.id_operator = id_operator;
    if (tanggal_mulai) data.tanggal_mulai = tanggal_mulai;
    if (tanggal_selesai) data.tanggal_selesai = tanggal_selesai;
    if (lokasi_pengiriman) data.lokasi_pengiriman = lokasi_pengiriman;
    if (nama_perusahaan) data.nama_perusahaan = nama_perusahaan;
    if (status) data.status = status;
    
    await Model_Pesanan.update(id, data);
    
    res.status(200).json({
      status: true,
      message: 'Pesanan berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui pesanan',
      error: error.message
    });
  }
});

// DELETE - Menghapus pesanan
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Cek apakah pesanan ada
    const pesananData = await Model_Pesanan.getId(id);
    if (!pesananData || pesananData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    
    // Hapus pesanan
    await Model_Pesanan.delete(id);
    
    res.status(200).json({
      status: true,
      message: 'Pesanan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus pesanan',
      error: error.message
    });
  }
});

// GET - Mendapatkan detail riwayat pesanan untuk pelanggan
router.get('/pelanggan/:id/detail', async (req, res) => {
  try {
    const idPelanggan = req.params.id;
    const pesanan = await Model_Pesanan.getDetailByPelanggan(idPelanggan);
    
    res.status(200).json({
      status: true,
      message: 'Detail riwayat pesanan pelanggan berhasil diambil',
      data: pesanan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail riwayat pesanan pelanggan',
      error: error.message
    });
  }
});

// GET - Mendapatkan detail lengkap pesanan berdasarkan ID
router.get('/detail/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pesanan = await Model_Pesanan.getDetailedById(id);
    
    if (!pesanan || pesanan.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail lengkap pesanan berhasil diambil',
      data: pesanan[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail lengkap pesanan',
      error: error.message
    });
  }
});

module.exports = router; 