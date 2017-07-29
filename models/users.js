var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	twitter: {
        name: String,
        id: String
    },
    lastSearch: String
});

module.exports = mongoose.model('User', User);