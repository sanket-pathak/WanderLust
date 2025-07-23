const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true  
    },
    description:{
        type: String,
        required: true,
        trim: true  
    },
    image:{
        
            filename:{type:String, default:"listingimage"},
            //this is the default image name
            url: { 
                type : String,
        default: "https://images.unsplash.com/photo-1742845918430-c6093f93f740?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",   
        set:(v) => v === "" ? "https://images.unsplash.com/photo-1742845918430-c6093f93f740?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        //we used set so that if no image is provided,or if an image is provided but not link,
        //  it will set a default image
        //this is a default image from unsplash
            
        }
    },
    price:{
         type: Number,
         required: true,
    },
    location:{
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    country:{
         type: String,
         required: true,

    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry:{
        type:{
            type:String,
            enum: ['Point'],
            required:true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

//this is a middleware to delete the reviews when the listing is deleted
listingSchema.post('findOneAndDelete', async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
