const User = require("../models/user.model.js");

// Create and Save a new User
exports.create = (req, res) => {
	// Validate request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    user_id: req.body.user_id,
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send({
			success: true,
			data
		});
  });
};

// Retrieve all Users from the database (with condition).
exports.findAllUser = () => {
  return new Promise((resolve, reject) => {
    User.getAll('', (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
  
};

exports.findAll = async(req, res) => {
	try {
    const response = await this.findAllUser()
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

// Find a single User with a id
exports.findOneUser = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
  
};
exports.findOne = async (req, res) => {
	try {
    const response = await this.findOneUser(req.params.id)
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

// Update a User identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.id,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
						error: true,
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
						error: true,
            message: "Error updating User with id " + req.params.id
          });
        }
      } else res.send({
				success: true,
				data
			});
    }
  );
};


// Delete a User with the specified id in the request
exports.delete = async(req, res) => {  
	User.remove(req.params.id, async(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Could not delete User with id " + req.params.id
        });
      }
    } else {
      res.send({ 
        success: true,
        message: `User was deleted successfully!`
      });
    } 
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
	User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while removing all users."
      });
    else res.send({
			success: true,
			message: `All Users were deleted successfully!`
		});
  });
};