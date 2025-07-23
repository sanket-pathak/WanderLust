const express = require('express');
const router = express.Router({mergeParams : true}); // Merge params to access listing ID in review routes
const wrapAsync = require('../utils/wrapAsync.js'); // Import the wrapAsync function
const ExpressError = require("../utils/ExpressError.js"); // Import the ExpressError class
const { listingSchema , reviewSchema} = require('../schema.js'); // Import the Joi schema for validation
const Review = require("../models/review.js");
const Listing = require('../models/listing.js'); // Import the Listing model
const { validateReview, isLoggedin, isReviewAuthor} = require("../middleware.js"); // Import the isLoggedin middleware

const reviewController = require("../controllers/reviews.js"); // Import the review controller


//reviews post route
router.post("/" , isLoggedin ,validateReview, wrapAsync(reviewController.createReview)); 

//delete reviw route
router.delete("/:reviewId" ,isLoggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview)); // Delete review route

module.exports = router;

//we have used mergeparams to merge the params of the listing and review routes so that we can access the listing id in the review routes
//the routes in app.js is the parent and the routes here is the child
//so we can access the listing id in the review routes using req.params.id
