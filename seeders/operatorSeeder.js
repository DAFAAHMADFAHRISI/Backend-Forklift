const db = require('../config/databases');

const seedOperator = async () => {
    try {
        // Sample operator data
        const operators = [
            {
                nama_operator: 'Budi Santoso',
                no_hp: '081234567891',
                status: 'tersedia'
            },
            {
                nama_operator: 'Siti Rahayu',
                no_hp: '081234567892',
                status: 'tersedia'
            }
        ];

        // Insert operators
        for (const op of operators) {
            await db.query(
                'INSERT INTO operator (nama_operator, no_hp, status) VALUES (?, ?, ?)',
                [op.nama_operator, op.no_hp, op.status]
            );
        }

        console.log('Operators seeded successfully!');
    } catch (error) {
        console.error('Error seeding operators:', error);
        throw error;
    }
};

module.exports = seedOperator; 