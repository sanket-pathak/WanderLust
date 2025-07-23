//will export the wrapAsync function to the error handling middleware of the app.js file
module.exports = (fn) =>{
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    };
};