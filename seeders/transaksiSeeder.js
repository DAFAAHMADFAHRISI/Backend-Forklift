const db = require('../config/databases');

const seedTransaksi = async () => {
    try {
        const pembayaran = [
            {
                id_pemesanan: 1,
                jumlah: 2100000.00,
                metode: 'transfer',
                tanggal_pembayaran: '2024-07-03'
            },
            {
                id_pemesanan: 2,
                jumlah: 3200000.00,
                metode: 'transfer',
                tanggal_pembayaran: '2024-07-05'
            }
        ];
        for (const t of pembayaran) {
            await db.query(
                'INSERT INTO pembayaran (id_pemesanan, jumlah, metode, tanggal_pembayaran) VALUES (?, ?, ?, ?)',
                [t.id_pemesanan, t.jumlah, t.metode, t.tanggal_pembayaran]
            );
        }
        console.log('Pembayaran seeded successfully!');
    } catch (error) {
        console.error('Error seeding pembayaran:', error);
        throw error;
    }
};

module.exports = seedTransaksi; 