const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

//create our express app
const app = express();
app.use(helmet());

//connection to mongodb
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.1qly4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mongoSanitize({ replaceWith: '_' }));

app.use('/images', express.static(path.join(__dirname, 'images')));

//set the endpoint and the router to be used
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//exported so is accesible outside the file
module.exports = app;
