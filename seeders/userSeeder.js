const db = require('../config/databases');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
    try {
        // Sample user data
        const users = [
            {
                nama: 'Admin',
                email: 'admin@gmail.com',
                no_hp: '081234567890',
                alamat: 'Jl. Admin No. 1',
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                role: 'admin'
            },
            {
                nama: 'User',
                email: 'user@gmail.com',
                no_hp: '081234567891',
                alamat: 'Jl. User No. 1',
                username: 'user',
                password: await bcrypt.hash('user123', 10),
                role: 'user'
            }
        ];

        // Insert users
        for (const user of users) {
            await db.query(
                'INSERT INTO user (nama, email, no_hp, alamat, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user.nama, user.email, user.no_hp, user.alamat, user.username, user.password, user.role]
            );
        }

        console.log('Users seeded successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};

module.exports = seedUsers; 