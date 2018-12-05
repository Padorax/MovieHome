var Movie = require("../models/movie"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

middlewareObj.checkMovieOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Movie.findById(req.params.id, function(err, foundMovie) {
            if(err) {
                res.redirect("back");
            } else {
                if (req.user.username ==="admin" || foundMovie.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}
// including admin, for deleting comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
                
				res.redirect("back");
			} else {
				if(req.user.username ==="admin" ||foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		})
	 } else {
		res.redirect("back");
	 }
}
// donot include admin, for update comment
middlewareObj.checkCommentOwner = function(req, res, next) {
    if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
                
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		})
	 } else {
		res.redirect("back");
	 }    
}

module.exports = middlewareObj;