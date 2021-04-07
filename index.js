const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override")

const Product = require('./models/product');

// connecting db
mongoose.connect('mongodb://localhost:27017/msoccasion', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true
});

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

// home/welcome page for user
app.get("/home", function (req, res) {
   res.render("home");
});

app.get("/", function (req, res) {
   res.render("home");
});

// product display page
app.get("/products", async function (req, res) {
   const products = await Product.find({});
   res.render("products/index", { products });
});

// Renders form to add a new product to site
app.get("/products/new", function (req, res) {
   res.render("products/newProduct");
});

// contact page for customer
app.get("/enquire", function (req, res) {
   res.render("contact/enquire");
});

// Saves a newly created product to the db and displays on index
app.post("/products", async function (req, res) {
   const product = new Product(req.body.product);
   await product.save();
   res.redirect(`/products/${product._id}`);
})

// Displays show page for a product
app.get("/products/:id", async function (req, res) {
   const product = await Product.findById(req.params.id);
   res.render("products/showProduct", { product });
});

// Renders the edit form for a current product
app.get("/products/:id/edit", async function (req, res) {
   const product = await Product.findById(req.params.id);
   res.render("products/editProduct", { product });
});

// Send a put request to update the information received from the update form
app.put("/products/:id", async function (req, res) {
   const { id } = req.params;
   const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
   res.redirect(`/products/${product._id}`);
})

// Will look up the product by id and delete from DB
app.delete("/products/:id", async function (req, res) {
   const { id } = req.params;
   await Product.findByIdAndDelete(id);
   res.redirect("/products");
});

// root to handle pages which do not exist
app.get("*", function (req, res) {
   res.send("404 Page not found");
})

app.listen(3000, function () {
   console.log("Serving on port 3000.");
})