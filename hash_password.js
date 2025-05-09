const bcrypt = require('bcryptjs');

const password = 'admin123'; // Ganti dengan password yang ingin di-hash

bcrypt.hash(password, 10, function(err, hash) {
    if (err) throw err;
    console.log('Hash untuk password:', password);
    console.log(hash);
}); 