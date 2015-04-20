var mongoose = require('mongoose');

module.exports = mongoose.model('Order',{
	timestamp : String,
	userID : String,
	fullName : String,
	contactNumber : String,
	order : String,
	company : String
});