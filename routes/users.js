// contains all the routes associated with users, these are
// then exported to be better and easily maintained,
// involves login and logout

const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
// const users = require("../controllers/users")

router.get("/register", function (req, res) {
   res.render("users/register");
});

router.post("/register", catchAsync(async function (req, res, next) {
   const { email, username, password } = req.body;
   const user = new User({ email, username });
   const registeredUser = await User.register(user, password);
   // logs in user as soon as they register
   req.login(registeredUser, function(err){
      if(err) return next(err);
   })
   res.redirect("/products");
}));

router.get("/login", function (req, res) {
   res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), function (req, res) {
   req.flash("success", "Welcome back");
   // redirects to orginal url the user was at before the 
   // login was prompted, followed by removing the returnTo value
   const redirectUrl = req.session.returnTo || "/products";
   delete req.session.returnTo;
   res.redirect(redirectUrl);
})

// router.route("/login")
//     .get(users.renderLogin)
//     .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', function(req, res){
   req.logout();
   req.flash("success", "Successfully logged out.")
   res.redirect("/products");
})

module.exports = router;