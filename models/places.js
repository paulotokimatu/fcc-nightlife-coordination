var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Place = new Schema({
	name: String,
	image_url: String,
	price: String,
	rating: Number,
	url: String,
	address: String,
	city: String,
	likes: [String]
});

module.exports = mongoose.model('Place', Place);
