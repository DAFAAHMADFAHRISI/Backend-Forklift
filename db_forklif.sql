-- Database: db_forklif

-- Tabel pelanggan
CREATE TABLE pelanggan (
    id_pelanggan INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100),
    email VARCHAR(100),
    no_hp VARCHAR(20),
    alamat TEXT
);

INSERT INTO pelanggan (nama, email, no_hp, alamat) VALUES
('Andi Saputra', 'andi@email.com', '081234567890', 'Jl. Merdeka No. 12'),
('Siti Aminah', 'siti@email.com', '082233445566', 'Jl. Kartini No. 45');

-- Tabel unit_forklift
CREATE TABLE unit_forklift (
    id_unit INT AUTO_INCREMENT PRIMARY KEY,
    nama_unit VARCHAR(100),
    kapasitas ENUM('2.5', '3', '5', '7', '10'),
    gambar VARCHAR(255),
    status ENUM('tersedia', 'disewa') DEFAULT 'tersedia'
);

-- Data unit dikosongkan dulu
-- INSERT INTO unit_forklift (...) VALUES (...);

-- Tabel operator
CREATE TABLE operator (
    id_operator INT AUTO_INCREMENT PRIMARY KEY,
    nama_operator VARCHAR(100),
    no_hp VARCHAR(20),
    status ENUM('tersedia', 'dipesan', 'tidak tersedia') DEFAULT 'tersedia'
);

INSERT INTO operator (nama_operator, no_hp, status) VALUES
('Budi Santoso', '081122334455', 'tersedia'),
('Rina Marlina', '085566778899', 'tidak tersedia');

-- Tabel pemesanan
CREATE TABLE pemesanan (
    id_pemesanan INT AUTO_INCREMENT PRIMARY KEY,
    id_pelanggan INT,
    id_unit INT,
    id_operator INT,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    lokasi_pengiriman TEXT,
    nama_perusahaan VARCHAR(100),
    status ENUM('menunggu pembayaran', 'menunggu konfirmasi', 'dikirim', 'selesai') DEFAULT 'menunggu pembayaran',
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan),
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

-- Tabel bukti_transfer
CREATE TABLE bukti_transfer (
    id_bukti INT AUTO_INCREMENT PRIMARY KEY,
    id_pembayaran INT,
    file_bukti VARCHAR(255),
    gambar_bukti VARCHAR(255),
    tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_verifikasi ENUM('menunggu', 'diterima', 'ditolak') DEFAULT 'menunggu',
    FOREIGN KEY (id_pembayaran) REFERENCES pembayaran(id_pembayaran)
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