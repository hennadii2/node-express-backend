module.exports = app => {
  const medias = require("../controllers/media.controller.js");

  var router = require("express").Router();

  // Create a new Media
  router.post("/", medias.create);

  // Retrieve all Medias
  router.get("/", medias.findAll);

  // Retrieve a single Media with id
  router.get("/:id", medias.findOne);

  // Update a Media with id
  router.put("/:id", medias.update);

  // Delete a Media with id
  router.delete("/:id", medias.delete);

  // Delete all Medias
  //router.delete("/", medias.deleteAll);

  app.use('/api/medias', router);
};