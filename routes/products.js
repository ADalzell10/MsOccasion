// product route

const express = require("express");
const router = express.Router();
// wraps async function in try catch
const catchAsync = require('../utils/catchAsync');
// catchs errors and reports a message
const ExpressError = require('../utils/ExpressError');
// joi schema
const { productSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

// mongoose product model
const Product = require('../models/product');

// server side validation using Joi
const validateProduct = function (req, res, next) {
   const { error } = productSchema.validate(req.body);
   if (error) {
      const msg = error.details.map(el => el.message).join(",")
      throw new ExpressError(msg, 400);
   } else {
      next();
   }
}

// product display page
router.get("/", catchAsync(async function (req, res) {
   const products = await Product.find({});
   res.render("products/index", { products });
}));

// Renders form to add a new product to site
router.get("/new", isLoggedIn, function (req, res) {
   res.render("products/newProduct");
});

// Saves a newly created product to the db and displays on index
router.post("/", isLoggedIn, validateProduct, catchAsync(async function (req, res) {
   const product = new Product(req.body.product);
   await product.save();
   req.flash("success", "New Product Added!");
   res.redirect(`/products/${product._id}`);
}))

// Displays show page for a product
router.get("/:id", catchAsync(async function (req, res) {
   const product = await Product.findById(req.params.id);
   if (!product) {
      req.flash("error", "Cannot find the product you are looking for.")
      return res.redirect("/products");
   }
   res.render("products/showProduct", { product });
}));

// Renders the edit form for a current product
router.get("/:id/edit", isLoggedIn, catchAsync(async function (req, res) {
   const product = await Product.findById(req.params.id);
   if (!product) {
      req.flash("error", "Cannot find the product you are looking for.")
      return res.redirect("/products");
   }
   res.render("products/editProduct", { product });
}));

// Send a put request to update the information received from the update form
router.put("/:id", isLoggedIn, validateProduct, catchAsync(async function (req, res) {
   const { id } = req.params;
   const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
   req.flash("success", "Product Updated!");
   res.redirect(`/products/${product._id}`);
}));

// Will look up the product by id and delete from DB
router.delete("/:id", isLoggedIn, catchAsync(async function (req, res) {
   const { id } = req.params;
   await Product.findByIdAndDelete(id);
   req.flash("success", "Product Deleted!");
   res.redirect("/products");
}));

module.exports = router;