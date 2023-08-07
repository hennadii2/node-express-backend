module.exports = app => {
  const looks = require("../controllers/look.controller.js");

  var router = require("express").Router();

  // Create a new Look
  router.post("/", looks.create);

  // Retrieve all Looks
  router.get("/", looks.findAll);

  // Retrieve a single Look with id
  router.get("/:id", looks.findOne);

  // Update a Look with id
  router.put("/:id", looks.update);

  // Delete a Look with id
  router.delete("/:id", looks.delete);

  // Delete all Looks
  //router.delete("/", looks.deleteAll);

  app.use('/api/looks', router);
};