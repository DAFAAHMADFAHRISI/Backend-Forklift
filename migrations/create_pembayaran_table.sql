CREATE TABLE pembayaran (
    id_pembayaran INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(255),
    id_pemesanan INT NOT NULL,
    jumlah DECIMAL(10,2) NOT NULL,
    metode ENUM('transfer', 'midtrans') NOT NULL,
    status ENUM('pending', 'success', 'failed', 'challenge') DEFAULT 'pending',
    tanggal_pembayaran DATETIME NOT NULL,
    bukti_pembayaran VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pemesanan) REFERENCES pemesanan(id_pemesanan) ON DELETE CASCADE
); 