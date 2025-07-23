if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); // Load environment variables from .env file
}
//console.log(process.env); // Log the MongoDB URL from environment variables

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js'); // Import the Listing model

const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");//for styling the ejs pages for the common layout
const wrapAsync = require('./utils/wrapAsync.js'); // Import the wrapAsync function
const ExpressError = require("./utils/ExpressError.js"); // Import the ExpressError class
const { listingSchema , reviewSchema} = require('./schema.js'); // Import the Joi schema for validation
const { required } = require('joi');
const Review = require("./models/review.js");
const session = require('express-session'); // Import express-session for session management
const MongoStore = require("connect-mongo");//Import connect Mongo
const flash = require('connect-flash'); // Import connect-flash for flash messages

const passport = require('passport'); // Import passport for authentication
const LocalStrategy = require('passport-local'); // Import local strategy for passport
const User = require('./models/user.js'); // Import the User model

const listingRouter= require("./routes/listing.js"); // Import the listings route
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js'); // Import the user route

const cookieParser = require('cookie-parser'); // Import cookie-parser for handling cookies
app.use(cookieParser("secretcdoe")); // Use cookie-parser middleware

// Connect to MongoDB
//const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; // Replace with your MongoDB URL
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
    
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(methodOverride('_method')); // Middleware for method override
app.engine('ejs', ejsMate); // Use ejs-mate for layout support
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory


//define the mongo store configuration
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600, //after this much seconds the info will erode
});

store.on("error", () =>{
    console.log("Error in MONGO SESSION STORE", err);
});

// defined the session configuration options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Set cookie expiration to 7 days(time in milliseconds)
        maxAge: 1000 * 60 * 60 * 24 * 7, // Set cookie max age to 7 days (time in milliseconds)
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    }
};



app.get('/', (req, res) => {
    res.redirect('/listings'); // Redirect to the listings page
});

//session middleware
app.use(session(sessionOptions)); // Use express-session middleware for session management
app.use(flash()); // Use connect-flash middleware for flash messages

//passport middleware
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use passport session middleware
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication

passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session



app.use((req, res, next) => {
    res.locals.success=req.flash("success"); // Make flash messages available in the response locals
    res.locals.error=req.flash("error"); // Make flash messages available in the response locals
    res.locals.currUser = req.user; // Make the current user available in the response locals
   // console.log(res.locals.success);
    next();
});

//demouser
// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({ 
//         email: "abc@gmail.com",
//         username:"sigma-stud",
//     })
//    let registereduser = await User.register(fakeuser,"hello user");
//    //resgister here means to create a new user 
//    res.send(registereduser);
// }); 

//test route to create a sample listing
//this is a test route to create a sample listing
// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Beautiful Mountain View",
//         description: "A stunning view of the mountains during sunset.",
//         price: 150,
//         location: "Mountain Range, USA",
//         country: "USA"
//     });

//     await sampleListing.save();
//     console.log("Sample listing created:");
//     res.send("Sample listing created!");
// });

app.use((req, res, next) => {
  res.locals.mapkey = process.env.MAP_API_KEY; // accessible in all views
  next();
});


//we are using the listings route for all routes starting with /listings
//the routes are defined in the routes/listing.js file
app.use("/listings", listingRouter); // Use the listings route for all routes starting with /listings
app.use("/listings/:id/reviews", reviewRouter); // Use the reviews route for all routes starting with /listings/:id/reviews
app.use("/", userRouter); // Use the user route for all routes starting with /user


// Middleware to handle 404 errors for all other routes
app.all("*", (req, res, next) => {
    console.log("404 for URL:", req.originalUrl);
    next(new ExpressError(404, "Page Not Found!"));
});

//Middleware to handle errors

app.use((err, req, res, next) => {
    let {statusCode = 500, message ="something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", { err });
    console.log(err);
    //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
}   );

/*
app.get("/getsignedcookie", (req, res) => {
    res.cookie("signed_cookie", "This is a signed cookie", { signed: true });
    res.send("Signed cookie set!");
});
app.get("/verify", (req, res) => {
    console.log(req.signedCookies); // Log the cookies to see the signed cookie
    res.send("Check the console for the signed cookie!");
});*/


