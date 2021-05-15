// contains all the routes associated with users, these are
// then exported to be better and easily maintained,
// involves login and logout

const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require("../controllers/users")
// const users = require("../controllers/users")

router.route("/register")
   // renders register form
   .get(users.registerForm)
   // registers a new user
   .post(catchAsync(users.register));

router.route("/login")
   // renders login form
   .get(users.loginForm)
   // logs user in
   .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), users.login)

// logs user out
router.get("/logout", users.logout)

module.exports = router;