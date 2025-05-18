const db = require('../config/databases');
const fs = require('fs');
const path = require('path');

const seedUnit = async () => {
    try {
        // Baca semua file gambar di folder public/images
        const imagesDir = path.join(__dirname, '../public/images');
        const imageFiles = fs.readdirSync(imagesDir).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

        // Contoh: gunakan 2 gambar pertama untuk 2 unit
        const units = [
            {
                nama_unit: 'Forklift Electric 1',
                kapasitas: '2.5',
                gambar: imageFiles[0] || null,
                status: 'tersedia',
                harga_per_jam: 300000.00
            },
            {
                nama_unit: 'Forklift Diesel 1',
                kapasitas: '5',
                gambar: imageFiles[0] || null,
                status: 'tersedia',
                harga_per_jam: 400000.00
            }
        ];

        // Insert units
        for (const unit of units) {
            await db.query(
                'INSERT INTO unit_forklift (nama_unit, kapasitas, gambar, status, harga_per_jam) VALUES (?, ?, ?, ?, ?)',
                [unit.nama_unit, unit.kapasitas, unit.gambar, unit.status, unit.harga_per_jam]
            );
        }

        console.log('Units seeded successfully!');
    } catch (error) {
        console.error('Error seeding units:', error);
        throw error;
    }
};

module.exports = seedUnit; 