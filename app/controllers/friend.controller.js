const Friend = require("../models/friend.model.js");
const Look = require("../models/look.model.js");

// Create and Save a new Friend
exports.create = (req, res) => {
	// Validate request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Create a Friend
  const friend = new Friend({
    name: req.body.name,
    user_id: req.body.user_id,
  });

  // Save Friend in the database
  Friend.create(friend, (err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while creating the Friend."
      });
    else res.send({
			success: true,
			data
		});
  });
};

// Retrieve all Friends from the database (with condition).
exports.findAllFriend = (user_id) => {
  return new Promise((resolve, reject) => {
    Friend.getAll(user_id, (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
  
};

exports.findAll = async(req, res) => {
  const user_id = req.query.user_id
	try {
    const response = await this.findAllFriend(user_id)
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

// Find a single Friend with a id
exports.findOneFriend = (id) => {
  return new Promise((resolve, reject) => {
    Friend.findById(id, (err, data) => {
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
    const response = await this.findOneFriend(req.params.id)
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

// Update a Friend identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  //console.log(req.body);

  Friend.updateById(
    req.params.id,
    new Friend(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
						error: true,
            message: `Not found Friend with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
						error: true,
            message: "Error updating Friend with id " + req.params.id
          });
        }
      } else res.send({
				success: true,
				data
			});
    }
  );
};

exports.findLooksByFriendId = (id) => {  
  return new Promise((resolve, reject) => {
    Look.getAllByFriendId(id, (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
};

exports.updateLookById = (id) => {  
  return new Promise((resolve, reject) => {
    Look.updateById(id, (err, data) => {
      if (err)
        reject({err})
      else {
        resolve({data})
      }
    });

  });
};

exports.deleteFriendByIdFromLooks = async(friendId) => {
  const response = await this.findLooksByFriendId(friendId)
  const looks = response.data
  
  if (looks && looks.length>0) {
    looks.forEach(look => {
      let newLook = look
      let friendIds = JSON.parse(newLook.friends)
      const newFriendIds = (friendIds && friendIds.length>0) ? friendIds.filter(id=> id.toString() !== friendId) : []
      const updatedFriendIds = JSON.stringify(newFriendIds)
      newLook.friends = updatedFriendIds
      
      Look.updateById(look.id, newLook, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            console.log(`Not found Look with id ${look.id}.`)
          } else {
            console.log(`Error updating Look with id ${look.id}`)
          }
        } else {
          //
        }
      });
    });
  }
}

// Delete a Friend with the specified id in the request
exports.delete = async(req, res) => {  
	Friend.remove(req.params.id, async(err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Friend with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Could not delete Friend with id " + req.params.id
        });
      }
    } else {
      await this.deleteFriendByIdFromLooks(req.params.id)
      res.send({ 
        success: true,
        message: `Friend was deleted successfully!`
      });
    } 
  });
};

// Delete all Friends from the database.
exports.deleteAll = (req, res) => {
	Friend.removeAll((err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while removing all friends."
      });
    else res.send({
			success: true,
			message: `All Friends were deleted successfully!`
		});
  });
};