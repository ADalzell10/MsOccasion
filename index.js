const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
// flash msg on action
const flash = require("connect-flash");
// catchs errors and reports a message
const ExpressError = require('./utils/ExpressError');
// allows product info to be deleted by overriding method
const methodOverride = require("method-override")

const products = require("./routes/products");

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

const sessionConfig = {
   // store,
   // name: "sessionDaz",
   // secret: secret,
   secret: "secretdaz",
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
       //   works under https
       //   secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
   }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(function(req, res, next){
   // gives access to error/success messages if any are added
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
})

app.use("/products", products);

// ********************************************************************
//                               ROUTES 
// ********************************************************************


// home/welcome page for user
app.get("/home", function (req, res) {
   res.render("home");
});

app.get("/", function (req, res) {
   res.render("home");
});

// contact page for customer
app.get("/enquire", function (req, res) {
   res.render("contact/enquire");
});

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