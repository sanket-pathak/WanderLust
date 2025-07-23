const express = require('express');
const router = express.Router({mergeParams : true}); // Merge params to access listing ID in review routes
const User = require('../models/user.js'); // Import the User model
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/users.js"); // Import the user controller


router
.route("/signup")
//to render the signup page
.get( userController.renderSignupForm)// Render the registration page
//signup route is used to register a new user
.post( wrapAsync(userController.signup));


router
.route("/login")
//this route is used to render the login page
.get( userController.renderLoginForm) // Render the login page
//login route and authenticate the user
.post( saveRedirectUrl ,passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}), userController.login); // Authenticate the user using passport-local strategy


//logout route
router.get('/logout', userController.logout); // Log out the user

module.exports = router;