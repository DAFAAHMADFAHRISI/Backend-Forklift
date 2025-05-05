const connection = require("../config/databases");

class Model_Feedback {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT f.*, p.id_pelanggan FROM feedback f JOIN pemesanan p ON f.id_pemesanan = p.id_pemesanan ORDER BY f.id_feedback DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getByPemesanan(idPemesanan) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM feedback WHERE id_pemesanan = ? ORDER BY id_feedback DESC",
        [idPemesanan],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO feedback SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM feedback WHERE id_feedback = ?",
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
        "UPDATE feedback SET ? WHERE id_feedback = ?",
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
        "DELETE FROM feedback WHERE id_feedback = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_Feedback; 