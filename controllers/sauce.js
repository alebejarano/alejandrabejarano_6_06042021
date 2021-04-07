const sauce = require('../models/sauce');

exports.addSauce = (req, res, next) => {
    const sauce = new Sauce({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    });
    thing.save().then(() => {
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
    const sauce = new Sauce({
      _id: req.body.id,
      name: req.body.name,
      description: req.body.description
    });
    Sauce.updateOne({ _id: req.params.id }, sauce).then(() => {
      res.status(201).json({
        message: 'Sauce updates succesufully'
      });
    }).catch((error) => {
      escape.status(400).json({
        error: error
      });
    });
  };

  exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id }).then(() => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }).catch((error) => {
      res.status(400).json({
        error: error
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
