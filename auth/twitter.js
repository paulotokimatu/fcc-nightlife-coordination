var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/users');
var config = require('../_config');
var init = require('./passport');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(() => {
        User.findOne({"twitter.id": profile.id}, (err, user) => {
            if (err) {
                return done(err);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                User.create({
                    "twitter.id": profile.id,
                    "twitter.name": profile.displayName,
                    polls: []
                }, (err, newUser) => {
                    if (err) throw err;
                    return done(null, newUser)
                })
            }
        })
    })
  }

));

// serialize user into the session
init();

module.exports = passport;