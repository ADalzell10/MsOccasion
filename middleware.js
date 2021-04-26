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