const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../config/middleware/cacheMiddleware');

// Route untuk test cache dengan data statis
router.get('/static', cacheMiddleware, (req, res) => {
    res.json({
        message: 'Data statis dari cache',
        timestamp: new Date().toISOString(),
        data: {
            id: 1,
            nama: 'Forklift Test',
            harga: 150000000,
            status: 'Tersedia'
        }
    });
});

// Route untuk test cache dengan data dinamis
router.get('/dynamic', cacheMiddleware, (req, res) => {
    res.json({
        message: 'Data dinamis dari cache',
        timestamp: new Date().toISOString(),
        data: {
            id: Math.floor(Math.random() * 1000),
            nama: 'Forklift ' + Math.floor(Math.random() * 100),
            harga: Math.floor(Math.random() * 100000000),
            status: Math.random() > 0.5 ? 'Tersedia' : 'Tidak Tersedia'
        }
    });
});

module.exports = router; 