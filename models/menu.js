var mongoose = require('mongoose');

module.exports = mongoose.model('Menu',{
	comboID: String,
	comboName: String,
	mainCourse: String,
	drinks: String,
	isVisible : Boolean
});