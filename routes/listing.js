const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js'); // Import the wrapAsync function
const ExpressError = require("../utils/ExpressError.js"); // Import the ExpressError class
const { listingSchema , reviewSchema} = require('../schema.js'); // Import the Joi schema for validation
const Listing = require('../models/listing.js'); // Import the Listing model
const {isLoggedin, isOwner, validateListing} = require("../middleware.js"); // Import the isLoggedin middleware
const listingController = require("../controllers/listings.js"); // Import the listings controller
const multer = require('multer'); // Import multer for file uploads

const { storage } = require('../cloudConfig.js'); // Import cloudinary and storage configuration  
const upload = multer({ storage }); // Set the destination for uploaded files


router
.route("/")
//index route to get all listings
.get( wrapAsync(listingController.index))
//create route to create a new listing
.post( isLoggedin , upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.createListing));


//new route to create a new listing
router.get("/new",isLoggedin, listingController.renderNewForm);


router
.route("/:id")
//show route to get a single listing
.get( wrapAsync(listingController.showListing))
//update route to update a listing
.put( isLoggedin, isOwner, upload.single('image') ,validateListing, wrapAsync(listingController.updateListing))
//delete route to delete a listing
.delete( isLoggedin, isOwner ,wrapAsync(listingController.destroyListing));



//edit route to edit a listing
router.get("/:id/edit", isLoggedin, isOwner ,wrapAsync(listingController.renderEditForm));




module.exports = router;
