const connection = require("../config/databases");

class Model_Pelanggan {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan ORDER BY id_pelanggan DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO pelanggan SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan WHERE id_pelanggan = ?",
        [id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan WHERE email = ?",
        [email],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPhone(no_hp) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM pelanggan WHERE no_hp = ?",
        [no_hp],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async search(keyword) {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${keyword}%`;
      connection.query(
        "SELECT * FROM pelanggan WHERE nama LIKE ? OR email LIKE ? OR no_hp LIKE ? OR alamat LIKE ? ORDER BY id_pelanggan DESC",
        [searchQuery, searchQuery, searchQuery, searchQuery],
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
        "UPDATE pelanggan SET ? WHERE id_pelanggan = ?",
        [Data, id],
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
        "DELETE FROM pelanggan WHERE id_pelanggan = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_Pelanggan; 