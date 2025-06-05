/**
 * Routes Feedback
 * Menangani semua endpoint terkait feedback dan rating, termasuk:
 * - Pembuatan feedback baru
 * - Pengambilan data feedback
 * - Pengelolaan rating
 * - Analisis feedback
 */

const express = require('express');
const Model_Feedback = require('../model/Model_Feedback');
const router = express.Router();
const { verifyToken, userOnly, adminOnly } = require('../middleware/authMiddleware');
const Model_Pesanan = require('../model/Model_Pesanan');
const { createLogTransaksi } = require('../helpers/logHelper');

// Middleware untuk memastikan user sudah login
router.use(verifyToken);

// GET - Mendapatkan semua feedback
router.get('/', async (req, res) => {
  try {
    const feedback = await Model_Feedback.getAll();
    res.status(200).json({
      status: true,
      message: 'Data Feedback berhasil diambil',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      messaete: 'Gagal mengambil data feedback',
      error: error.message
    });
  }
});

// GET - Mendapatkan feedback berdasarkan ID pemesanan
router.get('/pemesanan/:id', async (req, res) => {
  try {
    const idPemesanan = req.params.id;
    const feedback = await Model_Feedback.getByPemesanan(idPemesanan);
    
    res.status(200).json({
      status: true,
      message: 'Data feedback berhasil diambil',
      data: feedback
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil data feedback',
      error: error.message
    });
  }
});

// GET - Mendapatkan feedback berdasarkan ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const feedback = await Model_Feedback.getId(id);
    
    if (!feedback || feedback.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Feedback tidak ditemukan'
      });
    }
    
    res.status(200).json({
      status: true,
      message: 'Detail feedback berhasil diambil',
      data: feedback[0]
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal mengambil detail feedback',
      error: error.message
    });
  }
});

// POST - Menambahkan feedback baru
router.post('/store', verifyToken, userOnly, async (req, res) => {
  console.log('HEADERS:', req.headers); // Debug log headers
  console.log('CONTENT-TYPE:', req.headers['content-type']); // Debug log content-type
  console.log('BODY:', req.body); // Debug log body
  try {
    const { id_pemesanan, rating, komentar } = req.body;
    // Validasi input
    if (typeof id_pemesanan === 'undefined' || typeof rating === 'undefined') {
      return res.status(400).json({
        status: false,
        message: 'ID pemesanan dan rating diperlukan'
      });
    }
    // Validasi rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: false,
        message: 'Rating harus antara 1 sampai 5'
      });
    }
    const feedbackData = {
      id_pemesanan,
      rating,
      komentar
    };
    await Model_Feedback.store(feedbackData);
    res.status(201).json({
      status: true,
      message: 'Feedback berhasil ditambahkan'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menambahkan feedback',
      error: error.message
    });
  }
});

// PATCH - Mengupdate feedback
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { rating, komentar } = req.body;
    
    // Cek apakah feedback ada
    const feedbackData = await Model_Feedback.getId(id);
    if (!feedbackData || feedbackData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Feedback tidak ditemukan'
      });
    }
    
    const data = {};
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          status: false,
          message: 'Rating harus antara 1 sampai 5'
        });
      }
      data.rating = rating;
    }
    if (komentar !== undefined) data.komentar = komentar;
    
    await Model_Feedback.update(id, data);
    res.status(200).json({
      status: true,
      message: 'Feedback berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal memperbarui feedback',
      error: error.message
    });
  }
});

// DELETE - Menghapus feedback
router.delete('/delete/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    
    // Cek apakah feedback ada
    const feedbackData = await Model_Feedback.getId(id);
    if (!feedbackData || feedbackData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Feedback tidak ditemukan'
      });
    }
    
    await Model_Feedback.delete(id);
    res.status(200).json({
      status: true,
      message: 'Feedback berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Gagal menghapus feedback',
      error: error.message
    });
  }
});

module.exports = router; 