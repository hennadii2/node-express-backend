const sql = require("./db.js");

// constructor
class Look {
  constructor(look) {
    this.title = look.title;
    this.location = look.location;
    this.date = look.date;
    this.friends = look.friends;
    this.note = look.note;
    this.media = look.media;
    this.user_id = look.user_id;
  }
  static create(newLook, result) {
    sql.query("INSERT INTO looks SET ?", newLook, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      //console.log("created look: ", { id: res.insertId, ...newLook });
      result(null, { id: res.insertId, ...newLook });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM looks WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //console.log("found look: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Look with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(user_id, result) {
    let query = "SELECT * FROM looks";

    if (user_id) {
      query += ` WHERE user_id = '${user_id}'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log("looks: ", res);
      result(null, res);
    });
  }
  static updateById(id, look, result) {
    sql.query(
      "UPDATE looks SET title = ?, location = ?, date = ?, friends = ?, note = ?, media = ? WHERE id = ?",
      [look.title, look.location, look.date, look.friends, look.note, look.media, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Look with the id
          result({ kind: "not_found" }, null);
          return;
        }

        //console.log("updated look: ", { id: id, ...look });
        result(null, { id: id, ...look });
      }
    );
  }
  static remove(id, result) {
    sql.query("DELETE FROM looks WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Look with the id
        result({ kind: "not_found" }, null);
        return;
      }

      //console.log("deleted look with id: ", id);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM looks", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log(`deleted ${res.affectedRows} looks`);
      result(null, res);
    });
  }

  static getAllByFriendId(friendId, result) {
    let query = "SELECT * FROM looks";

    if (friendId) {
      query += ` WHERE friends like '%,${friendId},%' OR friends like '%,${friendId}]%' OR friends like '%[${friendId},%' OR friends like '%[${friendId}]%'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log("looks: ", res);
      result(null, res);
    });
  }
}


module.exports = Look;