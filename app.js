const path = require('path')
const PORT = process.env.PORT || 5000

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Movie = require("./models/movie"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds")

// requiring routes
var movieRoutes = require("./routes/movies"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")

// mongoose.connect("mongodb://127.0.0.1/movie_v1", {useNewUrlParser: true });
mongoose.connect("mongodb://yuwei:mlabguo13@ds033046.mlab.com:33046/moviehome", {useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Expecto Patronum",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

// handling routes
app.use("/", indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))