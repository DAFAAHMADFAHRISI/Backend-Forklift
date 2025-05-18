const seedUsers = require('./userSeeder');
const seedUnit = require('./unitSeeder');
const seedOperator = require('./operatorSeeder');
const seedPesanan = require('./pesananSeeder');
const seedTransaksi = require('./transaksiSeeder');
const clearDatabase = require('./clearSeeder');

const runSeeders = async (clear = false) => {
    try {
        if (clear) {
            console.log('Clearing database...');
            const cleared = await clearDatabase();
            if (!cleared) {
                console.error('Failed to clear database');
                process.exit(1);
            }
        }

        // Run seeders in sequence
        await seedUsers();
        await seedUnit();
        await seedOperator();
        await seedPesanan();
        await seedTransaksi();

        console.log('All seeders completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error running seeders:', error);
        process.exit(1);
    }
};

// Check if --clear flag is passed
const shouldClear = process.argv.includes('--clear');
runSeeders(shouldClear); 