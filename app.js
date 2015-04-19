
/**
 * Module dependencies.
 */

module.exports = function (db) {
	var express = require('express');
	var MongoStore = require('connect-mongo')(express);
	var passport = require('./auth');
	var routes = require('./routes')(passport);
	var path = require('path');	
	var app = express();
	var session = require('cookie-session');

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'keyboard cat',
		store: new MongoStore({
			mongoose_connection: db
		})
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(function (req, res, next) {
		res.set('X-Powered-By', 'Munchbee');
		next();
	});
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	//app.get('/feed/:number', routes.feed);
	app.get('/feedback', routes.feedback);
	app.post('/feedback', routes.postFeedback);
	//app.get('/deletecombo/:id', routes.deleteCombo);

	app.get('/', routes.menu);
	app.post('/', routes.postOrder);

	app.get('/register',routes.register);
	app.post('/register', routes.addUser);
	app.get('/login', routes.login);
	app.post('/login', passport.authenticate('local'), function(req, res) {
	  console.log('logging');
	  res.redirect('/');
	});
	app.get('/logout', function(req, res) {
	  req.logout();
	  res.redirect('/');
	});
	
	app.get('/admin', routes.admin);
	app.get('/cancelorder',routes.cancelOrder);
	//app.get('/user', routes.user);

	return app;
}