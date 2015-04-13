var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Dev' || process.env.DB_URI);

module.exports = mongoose.connection;
