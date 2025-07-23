const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js"); // Import the ExpressError class
const { listingSchema , reviewSchema} = require('./schema.js'); // Import the Joi schema for validation
const Listing = require("./models/listing");
const Review = require("./models/review");

//middleware to validate the listing data
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
   
    if(error){
         console.log("error here now");
        let errmsg = error.details.map((el) => el.message).join(" ,");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
};

//middleware to validate the review data
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    //console.log("err here");
    if(error){
        console.log("error here");
        let errmsg = error.details.map((el) => el.message).join(" ,");
        throw new ExpressError(400, errmsg);
    }else{
        next();
    }
}


//middlware to check if the user is logged in
 module.exports.isLoggedin = (req, res, next) => {
   // console.log(req);
    if(!req.isAuthenticated()){
        // we want to redirect the user to the page they were trying to access before login
        req.session.redirectUrl = req.originalUrl; // Store the original URL in the session
        req.flash("error", "User must be logged in!");
        return res.redirect("/login");
    }
    next();
};

//middlware to store the redirect URL in the session
// this is used to redirect the user to the page they were trying to access before login
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl; // Store the redirect URL in locals for use in views
    }
    next();
};

//middleware to check if the user is the owner of the listing
module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error", "You don't have permission to do that!");
       return  res.redirect(`/listings/${id}`);
    }   

    next();
};

//middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error", "You don't have permission to do that!");
       return  res.redirect(`/listings/${id}`);
    }   

    next();
};