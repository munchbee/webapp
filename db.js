var mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI || 'mongodb://localhost/Dev' );

module.exports = mongoose.connection;
