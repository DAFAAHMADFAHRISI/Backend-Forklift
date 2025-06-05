/**
 * Routes Pelanggan
 * Menangani semua endpoint terkait data pelanggan, termasuk:
 * - Pengelolaan data pelanggan
 * - Pencatatan informasi kontak
 * - Riwayat pemesanan pelanggan
 * - Pengelolaan profil pelanggan
 */

const express = require('express');
const Model_Pelanggan = require('../model/Model_Pelanggan');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const Model_Pesanan = require('../model/Model_Pesanan');
const { createLogTransaksi } = require('../helpers/logHelper');
//done
// Middleware untuk memastikan user sudah login
router.use(verifyToken);

/**
 * GET /pelanggan
 * Mengambil semua data pelanggan (admin only)
 */
router.get('/', adminOnly, async (req, res) => {
  try {
    const pelanggan = await Model_Pelanggan.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Pelanggan berhasil diambil',
      data: pelanggan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data pelanggan',
      error: error.message
    });
  }
});

/**
 * GET /pelanggan/search
 * Mencari data pelanggan berdasarkan keyword
 * Query params: keyword
 */
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        status: false,
        message: 'Keyword pencarian diperlukan'
      });
    }
    
    const pelanggan = await Model_Pelanggan.search(keyword);
    res.status(200).json({
      status: true,
      message: 'Hasil pencarian pelanggan',
      data: pelanggan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal melakukan pencarian',
      error: error.message
    });
  }
});

/**
 * GET /pelanggan/:id
 * Mengambil detail pelanggan berdasarkan ID
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pelanggan = await Model_Pelanggan.getId(id);
    
    if (!pelanggan || pelanggan.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pelanggan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail pelanggan berhasil diambil',
      data: pelanggan[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail pelanggan',
      error: error.message
    });
  }
});

/**
 * POST /pelanggan
 * Membuat data pelanggan baru
 * Body harus berisi: nama, email, no_hp, alamat
 */
router.post('/store', async (req, res) => {
  try {
    const { nama, email, no_hp, alamat } = req.body;
    
    // Validasi minimal data
    if (!nama) {
      return res.status(400).json({
        status: false,
        message: 'Nama pelanggan diperlukan'
      });
    }
    
    const data = {
      nama,
      email,
      no_hp,
      alamat
    };
    
    const result = await Model_Pelanggan.store(data);
    res.status(201).json({
      status: true,
      message: 'Pelanggan berhasil ditambahkan',
      id_pelanggan: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menambahkan pelanggan',
      error: error.message
    });
  }
});

/**
 * PUT /pelanggan/:id
 * Mengupdate data pelanggan
 * Body berisi field yang akan diupdate
 */
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nama, email, no_hp, alamat } = req.body;
    
    // Cek apakah pelanggan ada
    const pelangganData = await Model_Pelanggan.getId(id);
    if (!pelangganData || pelangganData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pelanggan tidak ditemukan'
      });
    }
    
    // Data untuk update
    const data = {};
    if (nama) data.nama = nama;
    if (email) data.email = email;
    if (no_hp) data.no_hp = no_hp;
    if (alamat) data.alamat = alamat;
    
    await Model_Pelanggan.update(id, data);
    res.status(200).json({
      status: true,
      message: 'Pelanggan berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui pelanggan',
      error: error.message
    });
  }
});

/**
 * DELETE /pelanggan/:id
 * Menghapus data pelanggan (admin only)
 */
router.delete('/delete/:id', adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Cek apakah pelanggan ada
    const pelangganData = await Model_Pelanggan.getId(id);
    if (!pelangganData || pelangganData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pelanggan tidak ditemukan'
      });
    }
    
    await Model_Pelanggan.delete(id);
    res.status(200).json({
      status: true,
      message: 'Pelanggan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus pelanggan',
      error: error.message
    });
  }
});

/**
 * GET /pelanggan/:id/riwayat
 * Mengambil riwayat pemesanan pelanggan
 */
router.get('/:id/riwayat', async (req, res) => {
  try {
    const id = req.params.id;
    const riwayatPesanan = await Model_Pesanan.getByPelanggan(id);
    
    if (!riwayatPesanan || riwayatPesanan.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Riwayat pemesanan pelanggan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Riwayat pemesanan pelanggan berhasil diambil',
      data: riwayatPesanan
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil riwayat pemesanan pelanggan',
      error: error.message
    });
  }
});

module.exports = router; 