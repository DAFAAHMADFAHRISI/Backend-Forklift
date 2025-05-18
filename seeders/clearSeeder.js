const db = require('../config/databases');

const clearDatabase = async () => {
    try {
        // Disable foreign key checks temporarily
        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        // Clear all tables
        const tables = [
            'feedback',
            'log_transaksi',
            'bukti_transfer',
            'pembayaran',
            'pemesanan',
            'operator',
            'unit_forklift',
            'user'
        ];

        for (const table of tables) {
            await db.query(`TRUNCATE TABLE ${table}`);
            console.log(`Cleared table: ${table}`);
        }

        // Re-enable foreign key checks
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('All tables cleared successfully!');
        return true;
    } catch (error) {
        console.error('Error clearing database:', error);
        return false;
    }
};

module.exports = clearDatabase; 