const Listing = require("../models/listing");
const Review = require("../models/review.js"); // Import the Review model


// async callback for create review route
module.exports.createReview = async (req,res) =>{
    //console.log("here I am");
  let listing= await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Set the author of the review to the logged-in user

  listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();

//    console.log("new review saved");
//    res.send("new Review saved");
      req.flash("success", "New Review Created!");
      res.redirect(`/listings/${listing._id}`);
};

// //delete review route's async callback
module.exports.destroyReview = async (req,res) => {
  let {id,reviewId}=req.params;

  await Listing.findByIdAndUpdate(id, { $pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);

   req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};