ALTER TABLE pembayaran
ADD COLUMN order_id VARCHAR(255) AFTER id_pembayaran,
ADD COLUMN status ENUM('pending', 'success', 'failed', 'challenge') DEFAULT 'pending' AFTER metode; 