const Media = require("../models/media.model.js");
const handleSingleUploadFile = require('../utils/uploadSingle.js')
const path = require('path');
const fs = require('fs');

// Create and Save a new Media
exports.create = async (req, res) => {
	// Validate request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Save Media in storage
    
  try {
    const uploadResult = await handleSingleUploadFile(req, res);

    const uploadedFile = uploadResult.file;
    const { body } = uploadResult;

    // Save Media in the database  
    const file_path = path.basename(uploadedFile.path)
    const media = new Media({
      name: body.name,
      user_id: body.user_id,
      type: body.type,
      src: file_path,
    });

    Media.create(media, (err, data) => {
      if (err)
        res.status(500).send({
          error: true,
          message:
            err.message || "Some error occurred while creating the Media."
        });
      else res.send({
        success: true,
        data
      });
    });
  } catch (e) {
    console.log('e.message', e.message)
    res.status(422).send({ 
      error: true,
      message: e.message
    });
  }
  
};

// Retrieve all Medias from the database (with condition).
exports.findAllMedia = (user_id) => {
  return new Promise((resolve, reject) => {
    Media.getAll(user_id, (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
  
};

exports.findAll = async (req, res) => {
  const user_id = req.query.user_id
  try {
    const response = await this.findAllMedia(user_id)
    const {data, err } = response

    if (data) {
      res.send({
        success: true,
        data
      });
    }
  } catch (err) {
    res.status(500).send({
      error: true,
      message: err
    });
  }
	
};

// Find a single Media with a id
exports.findOneMedia = (id) => {

  return new Promise((resolve, reject) => {
    Media.findById(id, (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
  
};
exports.findOne = async(req, res) => {
  try {
    const response = await this.findOneMedia(req.params.id)
    const {data, err } = response

    if (data) {
      res.send({
        success: true,
        data
      });
    }
  } catch (err) {
    if (err.err) {
      if (err.err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Media with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Error retrieving Media with id " + req.params.id
        });
      }
    } else res.send({
			success: true,
			data
		});
  }	
};

// Update a Media identified by the id in the request
exports.update = async (req, res) => {
	// Validate Request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Delete from storage
  const mediaId = req.params.id  
  Media.findById(mediaId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Media with id ${mediaId}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Error retrieving Media with id " + mediaId
        });
      }
    } else {
      const uploadFilePath = path.resolve(__dirname, '../..', 'public/uploads');
      const filePath = uploadFilePath + '/' + data.src

      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        res.status(500).send({
					error: true,
          message: error
        });
      }
    }
  });

  // Upload into storage
  try {
    const uploadResult = await handleSingleUploadFile(req, res);

    const uploadedFile = uploadResult.file;
    const { body } = uploadResult;

    // Save Media in the database  
    const file_path = path.basename(uploadedFile.path)
    const media = new Media({
      name: body.name,
      type: body.type,
      src: file_path,
    });

    Media.updateById(
      req.params.id,
      media,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              error: true,
              message: `Not found Media with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              error: true,
              message: "Error updating Media with id " + req.params.id
            });
          }
        } else res.send({
          success: true,
          data
        });
      }
    );
  } catch (e) {
    res.status(422).send({ 
      error: true,
      message: e.message
    });
  }
  
};

// Delete a Media with the specified id in the request
exports.delete = (req, res) => {
  const mediaId = req.params.id

  Media.findById(mediaId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Media with id ${mediaId}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Error retrieving Media with id " + mediaId
        });
      }
    } else {
      // Delete from storage
      const uploadFilePath = path.resolve(__dirname, '../..', 'public/uploads');
      const filePath = uploadFilePath + '/' + data.src

      try {
        fs.unlinkSync(filePath);
        
        // Remove from medias table
        Media.remove(mediaId, (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                error: true,
                message: `Not found Media with id ${mediaId}.`
              });
            } else {
              res.status(500).send({
                error: true,
                message: "Could not delete Media with id " + mediaId
              });
            }
          } else res.send({
            success: true,
            message: `Media was deleted successfully!`
          });
        });

      } catch (error) {
        res.status(500).send({
					error: true,
          message: error
        });
      }

    }
  });

};

// Delete all Medias from the database.
exports.deleteAll = (req, res) => {
	Media.removeAll((err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while removing all medias."
      });
    else res.send({
			success: true,
			message: `All Medias were deleted successfully!`
		});
  });
};