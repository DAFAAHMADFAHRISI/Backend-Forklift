-- Database: db_forklif

-- Tabel user (sebelumnya pelanggan)
CREATE TABLE user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    no_hp VARCHAR(20),
    alamat TEXT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel unit_forklift
CREATE TABLE unit_forklift (
    id_unit INT AUTO_INCREMENT PRIMARY KEY,
    nama_unit VARCHAR(100),
    kapasitas ENUM('2.5', '3', '5', '7', '10'),
    gambar VARCHAR(255),
    status ENUM('tersedia', 'disewa') DEFAULT 'tersedia',
    harga_per_jam DECIMAL(10,2) DEFAULT 300000.00
);

-- Tabel operator
CREATE TABLE operator (
    id_operator INT AUTO_INCREMENT PRIMARY KEY,
    nama_operator VARCHAR(100),
    foto VARCHAR(255), -- kolom baru untuk nama file foto
    no_hp VARCHAR(20),
    status ENUM('tersedia', 'dipesan', 'tidak tersedia') DEFAULT 'tersedia'
);

-- Tabel pemesanan
CREATE TABLE pemesanan (
    id_pemesanan INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT,
    id_unit INT,
    id_operator INT,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    lokasi_pengiriman TEXT,
    nama_perusahaan VARCHAR(100),
    status ENUM('menunggu pembayaran', 'menunggu konfirmasi', 'dikirim', 'selesai') DEFAULT 'menunggu pembayaran',
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_unit) REFERENCES unit_forklift(id_unit),
    FOREIGN KEY (id_operator) REFERENCES operator(id_operator)
);

-- Tabel pembayaran
CREATE TABLE pembayaran (
    id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
    id_pemesanan INT,
    jumlah DECIMAL(10,2),
    metode VARCHAR(50),
    tanggal_pembayaran DATE,
    FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan)
);

-- Tabel log_transaksi
CREATE TABLE log_transaksi (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_pemesanan INT,
    status_transaksi VARCHAR(100),
    keterangan TEXT,
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan)
);

-- Tabel feedback
CREATE TABLE feedback (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    id_pemesanan INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    komentar TEXT,
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan)
);