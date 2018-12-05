var express = require("express"),
    router = express.Router({mergeParams: true}),
    Movie = require("../models/movie"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index.js");

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {movie: movie});
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if(err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Something went wrong...")
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // comment.author = req.user;
                    console.log(req.user.username + "created a new comment");
                    // changed/added comment author after create so need to save here
                    comment.save();
                    movie.comments.push(comment._id);
                    movie.save();
                    // console.log(comment);
                    req.flash("success", "Successfully added comment!")
                    res.redirect("/movies/" + movie._id);
                }
            })
            // var newComment = {text: req.body.comment[text], author: req.user}
            // Comment.create(newComment, function(err, newlyCreated) {
            //     if(err) {
            //         console.log(newlyCreated);
            //     } else {
            //         movie.comments.push(comment);
            //         movie.save();
            //         console.log(comment);
            //         res.redirect("/movies/" + movie._id);
            //     }
            // })
        }
    })
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {movie_id: req.params.id, comment: foundComment})
        }
    })
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        res.redirect("/movies/"+req.params.id);
    })
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/movies" + req.params.id);
        }
    })
});

module.exports = router;