// joi schema
const { productSchema } = require("./schemas.js");
// catchs errors and reports a message
const ExpressError = require('./utils/ExpressError');
// mongoose product model
const Product = require('./models/product');

// checks if user is loggedin before they can perform an action
module.exports.isLoggedIn = function(req, res, next){
   if(!req.isAuthenticated()){
      // saves the url the user was originally at
      // before being prompted to login to complete
      // an action
      req.session.returnTo = req.originalUrl;
      req.flash("error", "You must be signed in to perform this action.");
      return res.redirect("/login");
   }
   next();
}

// server side validation using Joi
module.exports.validateProduct = function (req, res, next) {
   const { error } = productSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(",")
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}

// checks if user is author of the product
module.exports.isAuthor = async function (req, res, next) {
   const { id } = req.params;
   const product = await Product.findById(id);
   // checks the user id matches that of the person attempting to update product information
   if (!product.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that.");
      return res.redirect(`/products/${id}`);
   }
   next();
}