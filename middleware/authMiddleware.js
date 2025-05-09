const jwt = require('jsonwebtoken');

// Middleware untuk verifikasi token
const verifyToken = (req, res, next) => {
    console.log('JWT_SECRET in middleware:', process.env.JWT_SECRET);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({
            status: false,
            message: 'Invalid token'
        });
    }
};

// Middleware untuk role admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. Admin only.'
        });
    }
};

// Middleware untuk role user (pelanggan)
const userOnly = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. User only.'
        });
    }
};

// Middleware untuk memastikan user hanya bisa akses data miliknya
const checkUserOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }

    const userId = parseInt(req.params.id_user || req.body.id_user);
    if (req.user.id_user === userId) {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. You can only access your own data.'
        });
    }
};

// Middleware untuk memastikan user hanya bisa akses pemesanan miliknya
const checkPesananOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }

    const userId = parseInt(req.params.id_user || req.body.id_user);
    if (req.user.id_user === userId) {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. You can only access your own orders.'
        });
    }
};

// Middleware untuk memastikan user hanya bisa akses feedback miliknya
const checkFeedbackOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }

    const userId = parseInt(req.params.id_user || req.body.id_user);
    if (req.user.id_user === userId) {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. You can only access your own feedback.'
        });
    }
};

// Middleware untuk memastikan user hanya bisa akses pembayaran miliknya
const checkPembayaranOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }

    const userId = parseInt(req.params.id_user || req.body.id_user);
    if (req.user.id_user === userId) {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. You can only access your own payments.'
        });
    }
};

// Middleware untuk memastikan user hanya bisa akses bukti transfer miliknya
const checkBuktiTransferOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }

    const userId = parseInt(req.params.id_user || req.body.id_user);
    if (req.user.id_user === userId) {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. You can only access your own transfer proofs.'
        });
    }
};

// Middleware untuk memastikan user hanya bisa akses log transaksi miliknya
const checkLogTransaksiOwnership = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
        return;
    }

    const userId = parseInt(req.params.id_user || req.body.id_user);
    if (req.user.id_user === userId) {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. You can only access your own transaction logs.'
        });
    }
};

module.exports = {
    verifyToken,
    adminOnly,
    userOnly,
    checkUserOwnership,
    checkPesananOwnership,
    checkFeedbackOwnership,
    checkPembayaranOwnership,
    checkBuktiTransferOwnership,
    checkLogTransaksiOwnership
}; 