const sql = require("./db.js");

// constructor
class Media {
  constructor(media) {
    this.name = media.name;
    this.type = media.type;
    this.user_id = media.user_id;
    this.src = media.src;
  }
  static create(newMedia, result) {
    sql.query("INSERT INTO medias SET ?", newMedia, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      //console.log("created media: ", { id: res.insertId, ...newMedia });
      result(null, { id: res.insertId, ...newMedia });
    });
  }
  static findById(id, result) {
    sql.query(`SELECT * FROM medias WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        //console.log("found media: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found Media with the id
      result({ kind: "not_found" }, null);
    });
  }
  static getAll(user_id, result) {
    let query = "SELECT * FROM medias";

    if (user_id) {
      query += ` WHERE user_id = '${user_id}'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      //console.log("medias: ", res);
      result(null, res);
    });
  }
  static updateById(id, media, result) {
    sql.query(
      "UPDATE medias SET name = ?, type = ?, src = ? WHERE id = ?",
      [media.name, media.type, media.src, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Media with the id
          result({ kind: "not_found" }, null);
          return;
        }

        //console.log("updated media: ", { id: id, ...media });
        result(null, { id: id, ...media });
      }
    );
  }
  static remove(id, result) {
    sql.query("DELETE FROM medias WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Media with the id
        result({ kind: "not_found" }, null);
        return;
      }

      //console.log("deleted media with id: ", id);
      result(null, res);
    });
  }
  static removeAll(result) {
    sql.query("DELETE FROM medias", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} medias`);
      result(null, res);
    });
  }
}

module.exports = Media;