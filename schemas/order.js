var mongoose = require('mongoose');

module.exports = mongoose.model('Order',{
	timestamp : String,
	userID : String,
	order : String
});