const connection = require("../config/databases");

class Model_BuktiTransfer {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT bt.*, p.id_pemesanan FROM bukti_transfer bt JOIN pembayaran p ON bt.id_pembayaran = p.id_pembayaran ORDER BY bt.id_bukti DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPembayaran(idPembayaran) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM bukti_transfer WHERE id_pembayaran = ? ORDER BY id_bukti DESC",
        [idPembayaran],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO bukti_transfer SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM bukti_transfer WHERE id_bukti = ?",
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async update(id, Data) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE bukti_transfer SET ? WHERE id_bukti = ?",
        [Data, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE bukti_transfer SET status_verifikasi = ? WHERE id_bukti = ?",
        [status, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM bukti_transfer WHERE id_bukti = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_BuktiTransfer; 