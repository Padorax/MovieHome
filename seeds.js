var mongoose = require("mongoose");
var Movie = require("./models/movie");
var Comment = require("./models/comment");

var data = [
    {
        name: "Coco",
        image:"https://i.ytimg.com/vi/zNCz4mQzfEI/maxresdefault.jpg",
        description: "Life is about remembering"
    },
    {
        name: "Frozen",
        image:"https://lumiere-a.akamaihd.net/v1/images/image_b349f970.jpeg",
        description: "Life is about remembering"
    },
    {
        name: "Geru",
        image:"https://res.allmacwallpaper.com/pic/Thumbnails/3316_728.jpg",
        description: "Life is about remembering"
    }
]

function seedDB() {
    Movie.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("removed");
        data.forEach(function(seed) {
            Movie.create(seed, function(err, movie) {
                if(err) {
                    console.log(err);
                } else {
                    Comment.create(
                        {
                        text: "Wonderful Movie",
                        author: "shinchan"
                        }, function(err, comment) {
                            if(err) {
                                consol.log(err);
                            } else {
                                movie.comments.push(comment);
                                movie.save();
                                console.log("added comments");
                            }
                        });
                }
            })
        })
    })
}

module.exports = seedDB;