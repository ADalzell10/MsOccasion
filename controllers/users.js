const User = require('../models/user');

module.exports.registerForm = function (req, res) {
   res.render("users/register");
};

module.exports.register = async function (req, res, next) {
   const { email, username, password } = req.body;
   const user = new User({ email, username });
   const registeredUser = await User.register(user, password);
   // logs in user as soon as they register
   req.login(registeredUser, function(err){
      if(err) return next(err);
   })
   res.redirect("/products");
};

module.exports.loginForm = function (req, res) {
   res.render("users/login");
};

module.exports.login = function (req, res) {
   req.flash("success", "Welcome back");
   // redirects to orginal url the user was at before the 
   // login was prompted, followed by removing the returnTo value
   const redirectUrl = req.session.returnTo || "/products";
   delete req.session.returnTo;
   res.redirect(redirectUrl);
};

module.exports.logout = function(req, res){
   req.logout();
   req.flash("success", "Successfully logged out.")
   res.redirect("/products");
};