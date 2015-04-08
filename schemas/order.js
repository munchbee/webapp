var mongoose = require('mongoose');

module.exports = mongoose.model('Order',{
	orderID : String,
	name : String,
	contactNumber : String,
	emailID : String,
	companyName : String,
	order : String
});