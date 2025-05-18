const db = require('../config/databases');

const seedPelanggan = async () => {
    try {
        // Sample pelanggan data
        const pelanggan = [
            {
                nama: 'John Doe',
                email: 'john@example.com',
                no_hp: '081234567890',
                alamat: 'Jl. Contoh No. 123',
                username: 'johndoe',
                password: 'password123',
                role: 'user'
            },
            {
                nama: 'Jane Smith',
                email: 'jane@example.com',
                no_hp: '089876543210',
                alamat: 'Jl. Sample No. 456',
                username: 'janesmith',
                password: 'password123',
                role: 'user'
            }
        ];

        // Insert pelanggan
        for (const p of pelanggan) {
            await db.query(
                'INSERT INTO user (nama, email, no_hp, alamat, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.nama, p.email, p.no_hp, p.alamat, p.username, p.password, p.role]
            );
        }

        console.log('Pelanggan seeded successfully!');
    } catch (error) {
        console.error('Error seeding pelanggan:', error);
        throw error;
    }
};

module.exports = seedPelanggan; 