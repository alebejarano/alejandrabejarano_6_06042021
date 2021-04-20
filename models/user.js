const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//to validate an information before saving it to the database
//checks if unique = true. We make sure there are not users with the same email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);