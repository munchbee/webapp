var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	userID : String,
	firstName : String,
	lastName : String,
	username : String,
	password : String,
	contactNumber : String,
	company : String,
	orderID : String
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
