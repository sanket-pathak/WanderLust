const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // Import passport-local-mongoose for user authentication

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose plugin to the user schema
//passport automatically adds username and password fields to the schema
//it also implements hashing and salting of the password
module.exports = mongoose.model('User', userSchema); // Export the User model