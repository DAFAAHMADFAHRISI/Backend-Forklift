const express = require('express');
const Model_Pesanan = require('../model/Model_Pesanan');
const router = express.Router();
const { verifyToken, adminOnly, userOnly, checkUserOwnership } = require('../middleware/authMiddleware');

// Protected route - User bisa lihat pesanan miliknya, admin bisa lihat semua
router.get('/', verifyToken, async (req, res) => {
    try {
        let pesanan;
        if (req.user.role === 'admin') {
            pesanan = await Model_Pesanan.getAll();
        } else {
            pesanan = await Model_Pesanan.getByUserId(req.user.id_user);
        }
        res.json({
            status: true,
            message: 'List pesanan',
            data: pesanan
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

// Protected route - User bisa buat pesanan
router.post('/', verifyToken, userOnly, async (req, res) => {
    try {
        const pesananData = {
            ...req.body,
            id_user: req.user.id_user // Pastikan id_user dari token
        };
        const result = await Model_Pesanan.Store(pesananData);
        res.json({
            status: true,
            message: 'Berhasil membuat pesanan',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

// Protected route - User hanya bisa akses pesanan miliknya
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const pesanan = await Model_Pesanan.getId(req.params.id);
        
        // Cek kepemilikan pesanan
        if (req.user.role !== 'admin' && pesanan.id_user !== req.user.id_user) {
            return res.status(403).json({
                status: false,
                message: 'Access denied. This is not your order.'
            });
        }

        res.json({
            status: true,
            message: 'Detail pesanan',
            data: pesanan
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
});

// Protected route - Hanya admin yang bisa update status pesanan
router.put('/:id/status', verifyToken, adminOnly, async (req, res) => {
    try {
        const result = await Model_Pesanan.updateStatus(req.params.id, req.body.status);
        res.json({
            status: true,
            message: 'Status pesanan berhasil diupdate',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
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

// POST - Membuat pesanan baru (admin only, gunakan id_user)
router.post('/store', verifyToken, adminOnly, async (req, res) => {
  try {
    const { id_user, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan, status } = req.body;
    // Validasi input
    if (!id_user || !id_unit || !tanggal_mulai || !tanggal_selesai || !lokasi_pengiriman) {
      return res.status(400).json({
        status: false,
        message: 'Semua field diperlukan'
      });
    }
    const pesananData = {
      id_user,
      id_unit,
      id_operator,
      tanggal_mulai,
      tanggal_selesai,
      lokasi_pengiriman,
      nama_perusahaan,
      status: status || 'menunggu pembayaran'
    };
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

// PATCH - Mengupdate pesanan (admin only, gunakan id_user)
router.patch('/update/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const { id_user, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan, status } = req.body;
    const pesananData = await Model_Pesanan.getId(id);
    if (!pesananData) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    const data = {};
    if (id_user) data.id_user = id_user;
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

// DELETE - Menghapus pesanan (admin only)
router.delete('/delete/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const pesananData = await Model_Pesanan.getId(id);
    if (!pesananData) {
      return res.status(404).json({
        status: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
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