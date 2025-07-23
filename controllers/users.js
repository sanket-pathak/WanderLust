const User = require("../models/user"); // Import the User model

//render the signup page
module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs'); // Render the registration page
};


//signup async callback
module.exports.signup = async (req, res) => {
    //though wrapasync will handle errors, we used trycatch to create a flash msg on that page itself
    try{
        let { username, email, password } = req.body; // Destructure the request body to get username, email, and password
    const newUser = new User({ email, username }); // Create a new user object with the provided email and username
    const registeredUser = await User.register(newUser, password); // Register the user with the provided password
    //console.log(registeredUser); // Log the registered user
    //after signup also login the user
    req.login(registeredUser, (err) => { // Log in the user after registration
        if (err) {
            return next(err); // Handle login error
        }
         req.flash('success', 'Welcome to AbodeStays!'); // Set a success message
    res.redirect("/listings"); // Redirect to the listings page
    });
   
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup"); // Redirect to the signup page if an error occurs
    }  
};

// //render the login page
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs'); // Render the login page
};

//login async callback
module.exports.login = async(req, res) => {
    req.flash("success","Logged in successfully"); // Send a success message if login is successful
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Get the redirect URL from the session or default to listings
    //this is done so that  if the user directly wants to login he should be redirected to listings as there will be 
   // no res.locals.redirectUrl bcz the middleware will not be called
    res.redirect(redirectUrl); // Redirect to the listings page 
}

//logout async callback
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Handle logout error
        }
        req.flash("success", "Logged out successfully"); // Send a success message
        res.redirect("/listings"); // Redirect to the listings page
    });
};