const midtransClient = require('midtrans-client');

// Create Snap API instance
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-uLWGkIjfhCFYP0Jw_M2PNASR',
    clientKey: 'SB-Mid-client-VFkLhZ3ppHjzlqXl'
});

module.exports = snap; 