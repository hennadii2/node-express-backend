const sql = require("./db.js");

// constructor
class User {
  constructor(user) {
    this.user_id = user.user_id;
    this.created_at = user.created_at;
  }
  static create(newUser, result) {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      //console.log("created user: ", { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //console.log("found user: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found User with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(user_id, result) {
    let query = "SELECT * FROM users";

    // if (user_id) {
    //   query += ` WHERE user_id LIKE '%${user_id}%'`;
    // }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log("users: ", res);
      result(null, res);
    });
  }
  static updateById(id, user, result) {
    sql.query(
      "UPDATE users SET user_id = ?, created_at = ? WHERE id = ?",
      [user.user_id, user.created_at, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found User with the id
          result({ kind: "not_found" }, null);
          return;
        }

        //console.log("updated user: ", { id: id, ...user });
        result(null, { id: id, ...user });
      }
    );
  }
  static remove(id, result) {
    sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      //console.log("deleted user with id: ", id);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM users", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log(`deleted ${res.affectedRows} users`);
      result(null, res);
    });
  }
}

module.exports = User;