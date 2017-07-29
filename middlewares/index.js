//var PollHandler = require("../controllers/server.poll_handler.js");
//var pollHandler = new PollHandler();

module.exports = {
    //middleware to check if user is logged in
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            //req.flash("error", "You must be logged!");
            res.send("error");
            //res.redirect("/");
        }
    }
}
    