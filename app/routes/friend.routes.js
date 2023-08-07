module.exports = app => {
  const friends = require("../controllers/friend.controller.js");

  var router = require("express").Router();

  // Create a new Friend
  router.post("/", friends.create);

  // Retrieve all Friends
  router.get("/", friends.findAll);

  // Retrieve a single Friend with id
  router.get("/:id", friends.findOne);

  // Update a Friend with id
  router.put("/:id", friends.update);

  // Delete a Friend with id
  router.delete("/:id", friends.delete);

  // Delete all Friends
  //router.delete("/", friends.deleteAll);

  app.use('/api/friends', router);
};