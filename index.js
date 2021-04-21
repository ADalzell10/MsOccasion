const express = require("express");
const ejsMate = require("ejs-mate");
const { productSchema } = require("./schemas.js");
// wraps async function in try catch
const catchAsync = require('./utils/catchAsync');
// catchs errors and reports a message
const ExpressError = require('./utils/ExpressError');
const path = require("path");
const mongoose = require("mongoose");
// allows product info to be deleted by overriding method
const methodOverride = require("method-override")

// mongoose product mondel
const Product = require('./models/product');
const { statSync } = require("fs");

// connecting db
mongoose.connect('mongodb://localhost:27017/msoccasion', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false
});

// displays message to verify the db is connected or if error
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
   console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// view directory for product and form views
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
// method override included to allow put and delete options
app.use(methodOverride("_method"));
// public directory includes js and css files
app.use(express.static(__dirname + '/public'));

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

// home/welcome page for user
app.get("/home", function (req, res) {
   res.render("home");
});

app.get("/", function (req, res) {
   res.render("home");
});

// product display page
app.get("/products", catchAsync(async function (req, res) {
   const products = await Product.find({});
   res.render("products/index", { products });
}));

// Renders form to add a new product to site
app.get("/products/new", function (req, res) {
   res.render("products/newProduct");
});

// contact page for customer
app.get("/enquire", function (req, res) {
   res.render("contact/enquire");
});

// Saves a newly created product to the db and displays on index
app.post("/products", validateProduct, catchAsync(async function (req, res) {
   const product = new Product(req.body.product);
   await product.save();
   res.redirect(`/products/${product._id}`);
}))

// Displays show page for a product
app.get("/products/:id", catchAsync(async function (req, res) {
   const product = await Product.findById(req.params.id);
   res.render("products/showProduct", { product });
}));

// Renders the edit form for a current product
app.get("/products/:id/edit", catchAsync(async function (req, res) {
   const product = await Product.findById(req.params.id);
   res.render("products/editProduct", { product });
}));

// Send a put request to update the information received from the update form
app.put("/products/:id", validateProduct, catchAsync(async function (req, res) {
   const { id } = req.params;
   const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
   res.redirect(`/products/${product._id}`);
}));

// Will look up the product by id and delete from DB
app.delete("/products/:id", catchAsync(async function (req, res) {
   const { id } = req.params;
   await Product.findByIdAndDelete(id);
   res.redirect("/products");
}));

// root to handle pages which do not exist
app.all("*", function (req, res, next) {
   next(new ExpressError("Page not found", 404));
})

app.use(function (err, req, res, next) {
   const { statusCode = 500 } = err;
   if (!err.message) err.message = "Something went wrong";
   res.status(statusCode).render("error", { err });
})

app.listen(3000, function () {
   console.log("Serving on port 3000.");
})