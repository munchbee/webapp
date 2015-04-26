var mongoose = require('mongoose');

module.exports = mongoose.model('Feedback',{
	title: String,
	feedback: String,
	rating: String,
	timestamp: String,
	userID: String,
	comboID: String
});
