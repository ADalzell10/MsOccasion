const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

// home/welcome page for user
app.get("/home", function (req, res) {
    res.render("home");
});

app.get("/", function (req, res) {
    res.render("home");
});

// product display page
app.get("/products", function (req, res) {
    res.render("products/all_products");
});

app.get("/products/:id", function (req, res) {
    res.render("products/show");
});

// contact page for customer
app.get("/contact", function (req, res) {
    res.render("contact/contact");
});

// root to handle pages which do not exist
app.get("*", function (req, res) {
    res.send("404 Page not found");
})

app.listen(3000, function () {
    console.log("Serving on port 3000.");
})