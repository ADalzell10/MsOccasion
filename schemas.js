const Joi = require('joi');

// server side validation with joi ensures fields are completed
module.exports.productSchema = Joi.object({
   product: Joi.object({
      title: Joi.string().required(),
      // images: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().min(0).required()
   }).required(),
   deleteImages: Joi.array()
})

