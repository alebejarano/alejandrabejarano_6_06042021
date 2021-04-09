const Sauce = require('../models/sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.createSauce = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decodedToken.userId;

  const url = req.protocol + '://' + req.get('host');
  req.body.sauce = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    userId: userId,
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
      message: 'Post saved successfully!'
    });
  }).catch((error) => {
    res.status(400).json({
      error: error
    });
  });
};

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

/* To modify the sauce, checks if we modify a file or just the metadata
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
        // To delete the previous image, after modification has been done
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

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => { //get acces to the sauce in the data base
    const filename = sauce.imageUrl.split('/images/')[1]; // everithing before the /images is the protocol and the hostname and everithing after it will be the filename
    fs.unlink(`images/${filename}`, () => { //to delete the file, first argument is the path of the file to delete, the second argument is the callback, called once file deletion is completed
      Sauce.deleteOne({ _id: req.params.id }).then(() => { //after file is deleted the sauce post will be deleted
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

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce.usersLiked === 1)

      Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
        res.status(201).json({
          message: 'Sauce liked!'
        });
      }).catch((error) => {
        escape.status(400).json({
          error: error
        });
      });
  });
};
