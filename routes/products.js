// product route

const express = require("express");
const router = express.Router();
// controller to maintain functionality of each product route
const products = require("../controllers/products");

// wraps async function in try catch
const catchAsync = require('../utils/catchAsync');
// middleware
const { isLoggedIn, validateProduct, isAuthor } = require("../middleware");

// mongoose product model
const Product = require('../models/product');

router.route("/")
   // product display page
   .get(catchAsync(products.index))
   // Saves a newly created product to the db and displays on index
   .post(isLoggedIn, validateProduct, catchAsync(products.createProduct));


// Renders form to add a new product to site
router.get("/new", isLoggedIn, products.newProductForm);

router.route("/:id")
   // Displays show page for a product
   .get(catchAsync(products.showProduct))
   // Send a put request to update the information received from the update form
   .put(isLoggedIn, isAuthor, validateProduct, catchAsync(products.updateProduct))
   // Will look up the product by id and delete from DB
   .delete(isLoggedIn, isAuthor, catchAsync(products.deleteProduct));


// Renders the edit form for a current product
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(products.editProductForm));

module.exports = router;