const connection = require("../config/databases");

class Model_Unit {
  static getAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM unit_forklift ORDER BY id_unit DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async getAvailable() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM unit_forklift WHERE status = 'tersedia' ORDER BY id_unit DESC",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  static async store(Data) {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO unit_forklift SET ?", Data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  static async getId(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM unit_forklift WHERE id_unit = ?",
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
        "UPDATE unit_forklift SET ? WHERE id_unit = ?",
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
        "UPDATE unit_forklift SET status = ? WHERE id_unit = ?",
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
        "DELETE FROM unit_forklift WHERE id_unit = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}

module.exports = Model_Unit; 