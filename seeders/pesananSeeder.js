const db = require('../config/databases');

const seedPesanan = async () => {
    try {
        const pesanan = [
            {
                id_user: 1,
                id_unit: 1,
                id_operator: 1,
                tanggal_mulai: '2024-07-01',
                tanggal_selesai: '2024-07-07',
                lokasi_pengiriman: 'Gudang A',
                nama_perusahaan: 'PT Satu',
                status: 'menunggu pembayaran'
            },
            {
                id_user: 2,
                id_unit: 2,
                id_operator: 2,
                tanggal_mulai: '2024-07-02',
                tanggal_selesai: '2024-07-10',
                lokasi_pengiriman: 'Gudang B',
                nama_perusahaan: 'PT Dua',
                status: 'menunggu pembayaran'
            }
        ];
        for (const p of pesanan) {
            await db.query(
                'INSERT INTO pemesanan (id_user, id_unit, id_operator, tanggal_mulai, tanggal_selesai, lokasi_pengiriman, nama_perusahaan, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [p.id_user, p.id_unit, p.id_operator, p.tanggal_mulai, p.tanggal_selesai, p.lokasi_pengiriman, p.nama_perusahaan, p.status]
            );
        }
        console.log('Pesanan seeded successfully!');
    } catch (error) {
        console.error('Error seeding pesanan:', error);
        throw error;
    }
};

module.exports = seedPesanan; 