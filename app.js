require('dotenv').config();
console.log('DEBUG JWT_SECRET:', process.env.JWT_SECRET);
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

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
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public/images')));
app.use('/public/images', express.static(path.join(__dirname, 'public/images')));

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

// Error handling
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Send JSON response for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            status: false,
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err : {}
        });
    }

    // Render error page for web routes
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
