const connection = require("../config/databases");

class Model_Pemesanan {
    static async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE pemesanan SET status = ? WHERE id_pemesanan = ?', 
                [status, id], 
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }
}

module.exports = Model_Pemesanan;