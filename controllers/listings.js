const Listing = require("../models/listing");

require('dotenv').config();

//index async callback
module.exports.index =async (req, res) => {
   const allListings= await Listing.find({});

   res.render("listings/index.ejs",{allListings});
};

//new form rendering callback
module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
}

//show route's async callback
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
   // console.log(listing);
   let mapkey = process.env.MAP_API_KEY;
    if(!listing){
        req.flash("error", "Listing requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

//create route post async callback
module.exports.createListing = async (req, res ,next) => {
   let url = req.file.path;
   let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    const { latitude, longitude } = req.body;
    newListing.owner = req.user._id; // Set the owner of the listing to the logged-in user
   // if(!newListing.title || !newListing.description || !newListing.price || !newListing.location || !newListing.country){
   newListing.image.filename = filename;
    newListing.image.url = url;
    // Add geometry data from hidden form inputs
    newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)] // GeoJSON uses [lon, lat]
    };
    let savedlisting= await newListing.save(); 
    console.log(savedlisting);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
   
};

//edit route's async callback
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage= originalImage.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing , originalImage});
};

//update route's async callback
module.exports.updateListing = async (req, res) => {
//     if(!req.body.listing){
//         throw new ExpressError(400, "Invalid Listing Data!");
//    }
     console.log(req.body);
    const { id } = req.params; 
     let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
     
     if (typeof req.file !=="undefined") {
        ;
        let url = req.file.path;
      let filename = req.file.filename;
      listing.image.filename = filename;
       listing.image.url = url;
      await listing.save();
     }
      req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//delete route's async callback
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success", " Listing Deleted!");
    res.redirect("/listings"); 
};