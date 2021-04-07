const express = require('express');
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauces');

const app = express();

mongoose.connect('mongodb+srv://lejitas:iHKhg53KH3VpGi10@cluster0.1qly4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('succefully connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas');
    console.error(error);
  });

app.use((req, res, next) => {
  res.setHeader('Acces-Control-Allow-Origin', '*');
  res.setHeader('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Acces-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/sauces', sauceRoutes);




module.exports = app;

//MONGODB PW: iHKhg53KH3VpGi10
//MONGODB CONNECTION: mongodb+srv://lejitas:<password>@cluster0.1qly4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority