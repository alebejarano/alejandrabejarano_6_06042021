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

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params.id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: `${url}/images/${req.file.filename}`,
      heat: req.body.sauce.heat
    };
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: sauce.imageUrl,
      heat: req.body.heat
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
    res.status(201).json({
      message: 'Sauce updated successufully'
    });
  }).catch((error) => {
    escape.status(400).json({
      error: error
    });
  });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then((sauce) => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id }).then(() => {
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
    if (sauce.usersLiked === 1 )

    Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
      res.status(201).json({
        message: 'Sauce liked!'
      });
    }).catch((error) => {
      escape.status(400).json({
        error: error
      });
    });
 })
}
