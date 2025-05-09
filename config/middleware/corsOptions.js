const onlyDomain = {
    // Daftar domain yang diizinkan untuk mengakses API
    origin: [
        'http://localhost:3000',    // React default port
        'http://localhost:4001',    // Development port 1
        'http://localhost:4002',    // Development port 2
        'http://127.0.0.1:3000',    // Localhost alternative
        'http://127.0.0.1:4001',    // Localhost alternative
        'http://127.0.0.1:4002'     // Localhost alternative
    ],
    credentials: true,              // Mengizinkan credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // HTTP methods yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Headers yang diizinkan
    exposedHeaders: ['Content-Range', 'X-Content-Range'],  // Headers yang diekspos ke client
    maxAge: 86400  // Cache preflight request untuk 24 jam
}

module.exports = {onlyDomain};