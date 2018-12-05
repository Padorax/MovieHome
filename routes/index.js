var express = require("express"),
    router = express(),
    passport = require("passport"),
    User = require("../models/user");
    

// root route
router.get("/", function(req, res) {
    res.render("landing");
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle signup logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Movie Home " + user.username);
            res.redirect("/movies");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
})

// handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/movies",
        failureRedirect: "/login"
    }), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You are logged out!");
    res.redirect("movies");
})

module.exports = router;