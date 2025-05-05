const express = require('express');
const Model_Pelanggan = require('../model/Model_Pelanggan');
const router = express.Router();
//done
// GET - Mendapatkan semua pelanggan
router.get('/', async (req, res) => {
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

// GET - Mencari pelanggan berdasarkan keyword
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

// GET - Mendapatkan pelanggan berdasarkan email
router.get('/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    
    if (!email) {
      return res.status(400).json({
        status: false,
        message: 'Email diperlukan'
      });
    }
    
    const pelanggan = await Model_Pelanggan.getByEmail(email);
    
    if (!pelanggan || pelanggan.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pelanggan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Pelanggan berhasil ditemukan',
      data: pelanggan[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mencari pelanggan',
      error: error.message
    });
  }
});

// GET - Mendapatkan pelanggan berdasarkan nomor HP
router.get('/phone/:no_hp', async (req, res) => {
  try {
    const no_hp = req.params.no_hp;
    
    if (!no_hp) {
      return res.status(400).json({
        status: false,
        message: 'Nomor HP diperlukan'
      });
    }
    
    const pelanggan = await Model_Pelanggan.getByPhone(no_hp);
    
    if (!pelanggan || pelanggan.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Pelanggan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Pelanggan berhasil ditemukan',
      data: pelanggan[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mencari pelanggan',
      error: error.message
    });
  }
});

// GET - Mendapatkan pelanggan berdasarkan ID
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

// POST - Menambahkan pelanggan baru
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

// PATCH - Mengupdate pelanggan
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

// DELETE - Menghapus pelanggan
router.delete('/delete/:id', async (req, res) => {
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

module.exports = router; 