var Places = require("../models/places.js");
var Users = require("../models/users.js");

var baseUrl = "https://fcc-api-projects-tokimatu.c9users.io";

function PlaceHandler() {
    this.updatePlacesDb = (req, res, body) => {
        //Update the last search query
        if(req.isAuthenticated()) {
            Users.update({"twitter.id": req.user.twitter.id}, {lastSearch: req.params.location}, (err) => {
                if (err) throw err;
            });
        }
        var allPlaceNames = [];
        
        //Send the result only after updating the db
        var counter = 0;
        var counterMax = body.businesses.length;
        function checkingEnd() {
            if (counter === counterMax) {
                Places.find({name: {$in: allPlaceNames} }, (err, allPlaces) => {
                    if (err) throw err;
                    res.send(allPlaces);
                });
            }
            
        }    
        //If the place does not exist in the collection, create it
        for (var i = 0; i < body.businesses.length; i++) {
            var onePlace = {
                name: body.businesses[i].name,
                image_url: body.businesses[i].image_url,
                price: body.businesses[i].price,
                rating: body.businesses[i].rating,
                address: body.businesses[i].location.address1,
                city: body.businesses[i].location.city,
                url : body.businesses[i].url,
                likes: []
            };
            allPlaceNames.push(body.businesses[i].name);
            
            Places.update({ name: {$in: body.businesses[i].name} },
                { $setOnInsert: onePlace },
                { upsert: true },
                (err, numModified) => {
                    if (err) throw err;
                    counter++;
                    checkingEnd();
                }
            );
        }
    };
    this.addLike = (req, res, id) => {
        //Places.update({_id: id}, { $push: { likes: req.user.twitter.id } }, (err) => {
        Places.update({_id: id}, { $addToSet: { likes: req.user.twitter.id } }, (err) => {
            if (err) throw err;
            res.send("success");
        });
    };
    this.removeLike = (req, res, id) => {
        Places.update({_id: id}, { $pull: { likes: req.user.twitter.id } }, (err) => {
            if (err) throw err;
            res.send("success");
        });
    }
}

module.exports = PlaceHandler;