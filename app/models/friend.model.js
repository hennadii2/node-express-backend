const sql = require("./db.js");

// constructor
class Friend {
  constructor(friend) {
    this.name = friend.name;
    this.user_id = friend.user_id;
    this.created_at = friend.created_at;
  }
  static create(newFriend, result) {
    sql.query("INSERT INTO friends SET ?", newFriend, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      //console.log("created friend: ", { id: res.insertId, ...newFriend });
      result(null, { id: res.insertId, ...newFriend });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM friends WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //console.log("found friend: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Friend with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(user_id, result) {
    let query = "SELECT * FROM friends";

    if (user_id) {
      query += ` WHERE user_id = '${user_id}'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log("friends: ", res);
      result(null, res);
    });
  }
  static updateById(id, friend, result) {
    sql.query(
      "UPDATE friends SET name = ?, user_id = ?, created_at = ? WHERE id = ?",
      [friend.name, user_id, friend.created_at, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Friend with the id
          result({ kind: "not_found" }, null);
          return;
        }

        //console.log("updated friend: ", { id: id, ...friend });
        result(null, { id: id, ...friend });
      }
    );
  }
  static remove(id, result) {
    sql.query("DELETE FROM friends WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Friend with the id
        result({ kind: "not_found" }, null);
        return;
      }

      //console.log("deleted friend with id: ", id);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM friends", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log(`deleted ${res.affectedRows} friends`);
      result(null, res);
    });
  }
}

module.exports = Friend;