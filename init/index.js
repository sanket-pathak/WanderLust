const mongoose = require('mongoose');
const initdata= require('./data.js');
const Listing = require('../models/listing.js');
// Import the Listing model

// Connect to MongoDB
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'; // Replace with your MongoDB URL

main().then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
    
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing listings
    initdata.data = initdata.data.map((obj) => ({
          ...obj,
          owner: "68234c1b8e950f4ae2e0182d",
    }));
    await Listing.insertMany(initdata.data); // Insert initial data
    console.log("Initial data inserted into the database.");
};
initDB();