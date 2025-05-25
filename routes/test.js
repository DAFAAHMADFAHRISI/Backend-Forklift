const express = require('express');
const router = express.Router();

// Route untuk test CORS
router.get('/cors-test', (req, res) => {
    res.json({
        message: 'CORS berhasil!',
        timestamp: new Date().toISOString()
    });
});

// Route untuk test Cache
router.get('/cache-test', (req, res) => {
    res.json({
        message: 'Data ini akan di-cache',
        timestamp: new Date().toISOString(),
        data: {
            id: 1,
            name: 'Test Data',
            value: Math.random() // Nilai random untuk membuktikan cache bekerja
        }
    });
});

// Route untuk test Rate Limiter
router.get('/rate-limit-test', (req, res) => {
    res.json({
        message: 'Rate limit test berhasil!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router; 