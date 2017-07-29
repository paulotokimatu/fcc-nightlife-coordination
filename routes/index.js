var request = require('request');
var PlaceHandler = require("../controllers/place_handler.js");
var secret = require("../secret.js");
var passportTwitter = require('../auth/twitter');
var mw = require('../middlewares');
var accessToken;

//Access the Yelp API token
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
};
// Configure the POST request
var options = {
    url: 'https://api.yelp.com/oauth2/token',
    method: 'POST',
    headers: headers,
    form: {
        grant_type: "client_credentials",
        client_id: secret.ID,
        client_secret: secret.secret
    }
};

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        accessToken = JSON.parse(body);
    }
})

function routes(app) {
    var placeHandler = new PlaceHandler();
    //var userHandler = new UserHandler();
    
    app.route('/auth/twitter').get(passportTwitter.authenticate('twitter'), (req, res) => {
        res.send("ok");
    });

    app.route('/auth/twitter/callback').get(passportTwitter.authenticate('twitter', { failureRedirect: '/' }), (req, res) => {
        // Successful authentication
        res.redirect("/");
        //res.json(req.user);
    });
    
    app.route("/logout").get((req, res) => {
        req.logout();
        res.redirect('/');
    });
    
    app.route("/").get((req, res) => {
        res.render("index", {user: req.user});
    });
    
    app.get('/favicon.ico', function(req, res) {
        res.status(204);
    });
    
    app.route("/:location").get((req, res) => {
        request({
            url: "https://api.yelp.com/v3/businesses/search?location=" + req.params.location,
            headers: {
                Authorization: ' Bearer ' + accessToken.access_token
            }},
            function(err, apiRes, body) {
                if (err) res.send("Problem");
                var body = JSON.parse(body);
                
                //The important fields are .image_url .price .rating .url .location.address1 .location.city .name
                placeHandler.updatePlacesDb(req, res, body);
            }
        );
    });
    
    app.route("/like/:placeId").post(mw.isLoggedIn, (req, res) => {
        if (req.body.action === "like") placeHandler.addLike(req, res, req.body.placeId);
        else if (req.body.action === "unlike") placeHandler.removeLike(req, res, req.body.placeId);
    });
    
    app.use(function (req, res, next) {
        res.status(404).send("Page not found!");
    });
}
    
module.exports = routes;
    