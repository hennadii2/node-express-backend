const Look = require("../models/look.model.js");
const Friend = require("../models/friend.model.js");
const Media = require("../models/media.model.js");
const { findOneMedia } = require("./media.controller.js");
const { findOneFriend } = require("./friend.controller.js");


// Create and Save a new Look
exports.create = async (req, res) => {
	// Validate request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  // Create a Look
  const look = new Look({
    title: req.body.title,
    user_id: req.body.user_id,
    location: req.body.location,
    date: req.body.date,
    friends: req.body.friends,
    note: req.body.note,
    media: req.body.media,
  });

  /**
   * Before save, check if all of the friend ids in request exist in friends table.
   */
  
  const reqFriends = JSON.parse(req.body.friends);
  let friendsErrorMessage = '';
  Friend.getAll('', (err, data) => {
    if (err) {
      friendsErrorMessage = err.message || "Some error occurred while retrieving friends."
    } else {
      reqFriends.some(id => {
        const isExist = data.some(obj => {
          return (obj.id === id)
        })
        
        if (!isExist) {
          friendsErrorMessage = `There's no friend with id:${id}`;
          return true
        }
        return false
      });
    }

    if (friendsErrorMessage) {
      res.status(500).send({
        error: true,
        message: friendsErrorMessage
      });
    } else {
      /**
       * Before save, check if media exists.
       */
      const mediaId = req.body.media;
      let mediaErrorMessage = '';
      Media.findById(mediaId, (err, data) => {
        if (err) {
          mediaErrorMessage = err.message || `Some error occurred while retrieving Media by ${mediaId}.`
        }    
        
        if (mediaErrorMessage) {
          res.status(500).send({
            error: true,
            message: mediaErrorMessage
          });
        } else {
          // Save Look in the database
          Look.create(look, (err, data) => {
            if (err)
              res.status(500).send({
                error: true,
                message:
                  err.message || "Some error occurred while creating the Look."
              });
            else {              
              const newReq = {
                params: {
                  id: data.id
                }
              }
              this.findOne(newReq, res)
            }
          });
        }
      });
    }

  });
};

exports.getFriendsByIds = async (ids) => {
  let friendsData = []
  let index = 0
  
  while (index < ids.length) {
    try {
      const friendResponse = await findOneFriend(ids[index])
      
      const friendData = {
        id: friendResponse.data.id,
        name: friendResponse.data.name,
      }
      
      friendsData = [...friendsData, friendData]
      
    } catch (error) {
      console.log(error)
    }
    index++
  }

  return friendsData  
}

exports.getMediaById = async (mediaId) => {
  let mediaData = {
    id: mediaId,
    type: 'photo',
    src: '',
  }

  try {
    const mediaResponse = await findOneMedia(mediaId)
    mediaData = {
      id: mediaResponse.data.id,
      type: mediaResponse.data.type,
      src: process.env.CONTENT_URL + mediaResponse.data.src,
    }
  } catch (error) {
    console.log(error)
  }

  return mediaData
}

// Retrieve all Looks from the database (with condition).
exports.findAllLook = (user_id) => {  
  return new Promise((resolve, reject) => {
    Look.getAll(user_id, (err, data) => {
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
    const response = await this.findAllLook(user_id)
    const {data, err } = response

    const resultData = data

    if (resultData && resultData.length > 0) {
      let index = 0
      while (index < resultData.length) {
        let lookData = resultData[index]

        const mediaId = lookData.media
        let mediaData = {}
        if (mediaId) {
          mediaData = await this.getMediaById(mediaId)
        }

        const friendIds = JSON.parse(lookData.friends)
        let friendsData = []
        if (friendIds && friendIds.length > 0) {
          friendsData = await this.getFriendsByIds(friendIds)
        }

        resultData[index].media = mediaData
        resultData[index].friends = friendsData

        index++
      }
    }

    res.send({
      success: true,
      data: resultData
    });
  } catch (error) {
    res.status(500).send({
      error: true,
      message: error
    });
  }
};

// Find a single Look with a id
exports.findOneLook = (id) => {  
  return new Promise((resolve, reject) => {
    Look.findById(id, (err, data) => {
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
    const response = await this.findOneLook(req.params.id)
    const {data} = response

    // media update
    const mediaId = data.media
    let mediaData = {}
    if (mediaId) {
      mediaData = await this.getMediaById(mediaId)
    }    

    // friends update
    const friendIds = JSON.parse(data.friends)
    let friendsData = []
    if (friendIds && friendIds.length > 0) {
      friendsData = await this.getFriendsByIds(friendIds)
    }

    if (data) {
      let resultData = data
      resultData.media = mediaData
      resultData.friends = friendsData
      res.send({
        success: true,
        data: resultData
      });
    }
    
  } catch (error) {
    if ( error.err && error.err.kind && error.err.kind == "not_found") {
      res.status(404).send({
        error: true,
        message: `Not found Look with id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        error: true,
        message: "Error retrieving Look with id " + req.params.id
      });
    }
  }  
	
};

// Update a Look identified by the id in the request
exports.update = (req, res) => {
	// Validate Request
  if (!req.body) {
    res.status(400).send({
			error: true,
      message: "Content can not be empty!"
    });
  }

  /**
   * Before update, check if all of the friend ids in request exist in friends table.
   */   
   const reqFriends = JSON.parse(req.body.friends);
   let errorMessage = '';
   Friend.getAll('', (err, data) => {
    if (err)
      errorMessage = err.message || "Some error occurred while retrieving friends."      
    else {
      reqFriends.some(id => {
        const isExist = data.some(obj => {
          return (obj.id === id)
        })
        
        if (!isExist) {
          errorMessage = `There's no friend with id:${id}`;
          return true
        }
        return false
      });
    }

    if (errorMessage) {
      res.status(500).send({
        error: true,
        message: errorMessage
      });
    } else {
      /**
       * Before save, check if media exists.
       */
      const mediaId = req.body.media;
      let mediaErrorMessage = '';
      if (!mediaId) {
        // Update Look in the database
        Look.updateById(
          req.params.id,
          new Look(req.body),
          (err, data) => {
            if (err) {
              if (err.kind === "not_found") {
                res.status(404).send({
                  error: true,
                  message: `Not found Look with id ${req.params.id}.`
                });
              } else {
                res.status(500).send({
                  error: true,
                  message: "Error updating Look with id " + req.params.id
                });
              }
            } else res.send({
              success: true,
              data
            });
          }
        );
      } else {
        Media.findById(mediaId, (err, data) => {
          if (err) {
            mediaErrorMessage = err.message || `Some error occurred while retrieving Media by ${mediaId}.`
          }    
          
          if (mediaErrorMessage) {
            res.status(500).send({
              error: true,
              message: mediaErrorMessage
            });
          } else {
            // Update Look in the database
            Look.updateById(
              req.params.id,
              new Look(req.body),
              (err, data) => {
                if (err) {
                  if (err.kind === "not_found") {
                    res.status(404).send({
                      error: true,
                      message: `Not found Look with id ${req.params.id}.`
                    });
                  } else {
                    res.status(500).send({
                      error: true,
                      message: "Error updating Look with id " + req.params.id
                    });
                  }
                } else res.send({
                  success: true,
                  data
                });
              }
            );
          }
        });
      }
      
    }
  });

};

// Delete a Look with the specified id in the request
exports.delete = (req, res) => {
	Look.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
					error: true,
          message: `Not found Look with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
					error: true,
          message: "Could not delete Look with id " + req.params.id
        });
      }
    } else res.send({ 
			success: true,
			message: `Look was deleted successfully!`
		});
  });
};

// Delete all Looks from the database.
exports.deleteAll = (req, res) => {
	Look.removeAll((err, data) => {
    if (err)
      res.status(500).send({
				error: true,
        message:
          err.message || "Some error occurred while removing all looks."
      });
    else res.send({
			success: true,
			message: `All Looks were deleted successfully!`
		});
  });
};