const express = require('express');
const router = express.Router();

// Import sub-routes
const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

// Gunakan sub-routes
router.use('/login', loginRoute);
router.use('/register', registerRoute);

module.exports = router; 