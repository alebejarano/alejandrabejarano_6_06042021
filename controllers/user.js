const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MaskData = require('maskdata');
const passwordValidator = require('password-validator');
const emailValidator = require('email-validator');

const schema = new passwordValidator();
schema
  .is().min(8)                                    // Minimum length 8
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(1)                                // Must have at least 1 digit
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


const maskedEmail = MaskData.maskEmail2;

exports.signup = (req, res, next) => {
  if (!emailValidator.validate(req.body.email)) {
    //to validate the email address
    res.status(400).json({
      error: 'email not valid'
    });
  }
  if (!schema.validate(req.body.password)) {
    //to validate the schema password
    res.status(400).json({
      error: 'password must contain at least 1 digit, min 8 characters, uppercase and lowercase letters'
    });
  }
  bcrypt.hash(req.body.password, 10).then((hash) => {
    //what we need to hash and the salt rounds
    const user = new User({
      email: maskedEmail(req.body.email),
      password: hash
    });
    user.save().then(() => {
      res.status(201).json({
        message: 'User added successfully!'
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  });
};

exports.login = (req, res, next) => {
  User.findOne({ email: maskedEmail(req.body.email) }).then((user) => {
    //make sure that we have valid user credentials, check if the email given by the user is the one we have in our database
    if (!user) {
      //the authentification failed
      return res.status(401).json({
        error: new Error('User not found!')
      });
    }
    //the user exist, but we need to check the user's password
    bcrypt.compare(req.body.password, user.password).then((valid) => {
      //comapre the password given by the user vs the one he have stored
      if (!valid) {
        //the password authentification failed
        return res.status(401).json({
          error: new Error('Incorrect password')
        });
      }
      const token = jwt.sign(
        //the data we want to encode
        { userId: user._id },
        //key
        process.env.SECRET_TOKEN,
        { expiresIn: '24h' });
      res.status(200).json({
        //the authentification is valid, passing our user id and the token
        userId: user._id,
        token: token
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};