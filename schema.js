const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().required(),
            url: Joi.string().allow('',null),
        }).required()
    }).required(),
    latitude: Joi.number().optional(),
  longitude: Joi.number().optional()
});
//made the latitude, longitude optional just bcz of edit feature
//as in the edit form the request dont contain the geometry
//for simplicity, we will not edit the location for now

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});