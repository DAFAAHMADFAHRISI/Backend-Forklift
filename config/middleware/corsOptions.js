const onlyDomain = {
    // Daftar domain yang diizinkan untuk mengakses API
    origin: '*', // Izinkan semua origin
    credentials: true,              // Mengizinkan credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],  // HTTP methods yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],  // Headers yang diizinkan
    exposedHeaders: ['Content-Range', 'X-Content-Range'],  // Headers yang diekspos ke client
    maxAge: 86400  // Cache preflight request untuk 24 jam
}

module.exports = {onlyDomain};