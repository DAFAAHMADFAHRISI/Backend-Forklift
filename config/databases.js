const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_forklif'
});

// Handle connection errors
db.on('error', (error) => {
    console.error('Database error:', error);
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting to database...');
        db.connect();
    } else {
        throw error;
    }
});

// Connect to database
db.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        return;
    }
    console.log('Database connection successful');
});

module.exports = db;