const express = require('express');
const Model_Operator = require('../model/Model_Operator');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// GET - Mendapatkan semua operator (semua user bisa akses)
router.get('/', verifyToken, async (req, res) => {
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

// GET - Mendapatkan operator yang tersedia (semua user bisa akses)
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

// GET - Mendapatkan operator berdasarkan ID (semua user bisa akses)
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

// POST - Menambahkan operator baru (admin only)
router.post('/store', verifyToken, adminOnly, async (req, res) => {
  try {
    const { nama_operator, no_hp, status } = req.body;
    
    const data = {
      nama_operator,
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

// PATCH - Mengupdate operator (admin only)
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

// PATCH - Update status operator (admin only)
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
router.put('/edit/:id', verifyToken, adminOnly, async (req, res) => {
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

module.exports = router;