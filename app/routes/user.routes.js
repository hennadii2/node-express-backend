module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new Friend
  router.post("/", users.create);

  // Retrieve all Friends
  router.get("/", users.findAll);

  // Retrieve a single Friend with id
  router.get("/:id", users.findOne);

  // Update a Friend with id
  router.put("/:id", users.update);

  // Delete a Friend with id
  router.delete("/:id", users.delete);

  // Delete all Friends
  //router.delete("/", users.deleteAll);

  app.use('/api/users', router);
};