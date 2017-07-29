require('dotenv').config()
var path = require("path");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var routes = require('./routes/index.js');
var passport = require("passport");
var session = require('express-session');
var accessToken;

mongoose.Promise = Promise;
mongoose.connect(process.env.DB);

//Setting sessions and passport to work with auth
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

//Middleware to parse POST requests
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen((process.env.PORT || 3000), () => {
    console.log("Server up");
});