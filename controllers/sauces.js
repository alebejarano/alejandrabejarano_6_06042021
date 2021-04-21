const Sauce = require('../models/sauce');
const fs = require('fs');

//Creates a sauce with an added file in our POST 
exports.createSauce = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  req.body.sauce = JSON.parse(req.body.sauce);
  //parse the stringify sauce into a jason object
  const sauce = new Sauce({
    //we create a new Sauce model
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: `${url}/images/${req.file.filename}`,
    heat: req.body.sauce.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save().then(() => {
    res.status(201).json({
      message: 'Sauce saved successfully!'
    });
  }).catch((error) => {
    res.status(400).json({
      error: error
    });
  });
};

/*GET: to retrieve one sauce from our database by
passing to the findOne method the id of the sauce*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then((sauce) => {
    res.status(200).json(sauce);
  }).catch((error) => {
    res.status(404).json({
      error: error
    });
  });
};

//GET: To retreive all the sauces from the databese
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then((sauces) => {
    res.status(200).json(sauces);
  }).catch((error) => {
    res.status(400).json({
      error: error
    });
  }
  );
};

/* PUT: To modify the sauce, checks if we modify a file or just the metadata
and deletes the last image, if the image was modified*/
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    //checks the id of the sauce to modify, so later we can retrive the url of the image of the sauce before the file changed
    let updatedSauce = new Sauce({ _id: req.params.id });
    //We need to pass the id to the new sauce 
    if (req.file) {
      //to see if the modif comes with a new file
      const url = req.protocol + '://' + req.get('host');
      req.body.sauce = JSON.parse(req.body.sauce);
      //Our new sauce updated
      updatedSauce = {
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: `${url}/images/${req.file.filename}`,
        heat: req.body.sauce.heat
      };
    } else {
      updatedSauce = {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat
      };
    }
    Sauce.updateOne({ _id: req.params.id }, updatedSauce).then(() => {
      //Sauce is successfully updated
      if (req.file) {
        // To delete the previous image, after modification has been successfully done
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) console.log(error);
        })
      }
      res.status(201).json({
        message: 'Sauce updated successufully'
      });
    }).catch((error) => {
      res.status(400).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(404).json({
      error: error
    });
  });
};

//To delete one sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    //get acces to the sauce in the data base
    const filename = sauce.imageUrl.split('/images/')[1];
    // everithing before the /images is the protocol and the hostname and everithing after it will be the filename
    fs.unlink(`images/${filename}`, () => {
      //to delete the file, first argument is the path of the file to delete, the second argument is the callback, called once file deletion is completed
      Sauce.deleteOne({ _id: req.params.id }).then(() => {
        //after file is deleted the sauce post will be deleted
        res.status(200).json({
          message: 'Deleted!'
        });
      }).catch((error) => {
        res.status(400).json({
          error: error
        });
      });
    });
  });
};

/*POST: To deal with the likes or dislikes of the created sauces
if like is = 1 the sauce is liked, if is = -1 is disliked. The count of the users likes are in an array */
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // to see if our user is in the array
    const userLikedIndex = sauce.usersLiked.indexOf(req.body.userId);
    const userLiked = userLikedIndex !== -1;
    const userDislikedIndex = sauce.usersDisliked.indexOf(req.body.userId);
    const userDisliked = userDislikedIndex !== -1;

    if (req.body.like === 1 && !userLiked) {
      //if the user has not liked the sauce yet and is going to
      sauce.likes++;
      sauce.usersLiked.push(req.body.userId);
      if (userDisliked) {
        //if the user had a dislike on the sauce
        sauce.dislikes--;
        sauce.usersDisliked.splice(userDislikedIndex, 1);
      };
    };
    if (req.body.like === -1 && !userDisliked) {
      //if the user has not dislike the sauce yet and is going to
      sauce.dislikes++;
      sauce.usersDisliked.push(req.body.userId);
      if (userLiked) {
        //if the user had a liked on the sauce
        sauce.likes--;
        sauce.usersLiked.splice(userLikedIndex, 1);
      };
    };
    Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
      res.status(201).json({
        message: `Mention j'aime modifié`
      });
    }).catch((error) => {
      res.status(400).json({
        error: error
      });
    });
  });
};
