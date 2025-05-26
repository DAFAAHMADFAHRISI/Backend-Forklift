const express = require('express');
const createError = require('http-errors');
const pemesananRouter = require('./routes/pemesanan');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { onlyDomain } = require('./config/middleware/corsOptions');
const cacheMiddleware = require('./config/middleware/cacheMiddleware');
const limiter = require('./config/middleware/ratelimiter');
const testRouter = require('./routes/test');
const testCacheRouter = require('./routes/test-cache');
const paymentRouter = require('./routes/payment');

var session = require('express-session');
const MemoryStore = require('express-session').MemoryStore;

// Import all routes
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/auth/login');
var registrasiRouter = require('./routes/auth/register');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');
var unitRouter = require('./routes/unit');
var pesananRouter = require('./routes/pesanan');
var pembayaranRouter = require('./routes/pembayaran');
var pelangganRouter = require('./routes/pelanggan');
var feedbackRouter = require('./routes/feedback');
var buktiTransferRouter = require('./routes/bukti_transfer');
var operatorRouter = require('./routes/operator');
var logTransaksiRouter = require('./routes/log_transaksi');

var app = express();

// Middleware
app.use(cors(onlyDomain));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public/images')));
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Test routes dengan middleware
app.use('/api/test/cors', testRouter); // Test CORS
app.use('/api/test/cache', cacheMiddleware, testRouter); // Test Cache
app.use('/api/test/rate-limit', limiter, testRouter); // Test Rate Limiter

// Terapkan rate limiter ke route yang membutuhkan pembatasan
app.use('/api/feedback', limiter); // Rate limit untuk route feedback
app.use('/api/pembayaran', limiter); // Rate limit untuk route pembayaran

// Terapkan cache middleware ke route yang membutuhkan caching
app.use('/api/units', cacheMiddleware); // Cache untuk route units
app.use('/api/pelanggan', cacheMiddleware); // Cache untuk route pelanggan

// Test routes
app.use('/api/test-cache', testCacheRouter);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    cookie: {
        maxAge: 6000
    },
    store: new MemoryStore(),
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));

// Case-insensitive route handling
app.use((req, res, next) => {
    // Convert URL to lowercase
    req.url = req.url.toLowerCase();
    next();
});

// Web routes
app.use('/', indexRouter);

// API routes
app.use('/api/auth/login', loginRouter);
app.use('/api/auth/register', registrasiRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/unit', unitRouter);
app.use('/api/pesanan', pesananRouter);
app.use('/api/pembayaran', pembayaranRouter);
app.use('/api/pelanggan', pelangganRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/bukti-transfer', buktiTransferRouter);
app.use('/api/operator', operatorRouter);
app.use('/api/log-transaksi', logTransaksiRouter);
app.use('/api/payment', paymentRouter);

// Add routes
app.use('/pemesanan', require('./routes/pemesanan'));

// Error handler for 404
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: false,
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;
