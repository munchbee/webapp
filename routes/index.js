
/*
 * GET home page.
 */

var feedbackSchema = require('../schemas/feedback');
var menuSchema = require('../schemas/menu');
var orderSchema = require('../schemas/order');
var userSchema = require('../schemas/user');

module.exports = function (passport) {
	var feed = require('../feedback');
	var order =require('../order');
	var user =require('../user');
	var functions = {};

/*
	functions.patchFeedback = function(req, res) {
		if (isLoggedIn(req)) {
			res.redirect('/login');
		} else {
			feedbackSchema.find()
			.setOptions({sort: 'feedbackID'})
			.exec(function(err, feeds) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					res.render('feedback', {
						title: 'Welcome!',
						user: req.user,
						feedback: feeds,
						lastNumber: req.session.lastNumber
					});
				}
			});
		}
	};*/
	
	functions.feedback = function(req, res) {
		//add condition to check for admins login
		
		if (isLoggedIn(req)) {
			res.redirect('/login');
		} else {
			res.render('feedback', {title: 'Feedback', user: req.user});
		}
	};

	functions.postFeedback = function(req, res) {
		//add condition to check for admins login
		
		if (isLoggedIn(req)) {
			res.redirect('/login');
		} else {
			
			var temp = feed(
			{'feedbackID':req.body.feedbackID,
			'feedback':req.body.feedback,
			'rating':req.body.rating}
			).getInformation();

			req.session.lastNumber = req.body.comboID;
			var record = new feedbackSchema(temp);

			record.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status: 'failure'});
				} else {
					res.json({status: 'success'});
				}
			});
			res.redirect('/');
		}
	};	

	/*functions.deleteCombo = function(req, res) { 
		feedbackSchema.remove({"comboID":req.params.id}, function(err, result) { 
		    res.send( (result === 1) ? { msg: 'Deleted' } : { msg: 'error: '+ err } );
		});
		res.redirect('/');
	}*/

	functions.menu = function(req, res) {
		if (isLoggedIn(req)) {
			res.redirect('/login');
		} else {
			menuSchema.find()
			.setOptions({sort: 'comboID'})
			.exec(function(err, combos) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					res.render('menu', {
						title: 'Welcome!',
						user: req.user,
						menu: combos
					});
				}
			});
		}
	};

	functions.postOrder = function(req, res) {
		//add condition to check for admins login
		
		if (isLoggedIn(req)) {
			res.redirect('/login');
		} else {
			
			//console.log(req.body.data);
			var temp = order(
			{
			'orderID' : timeStamp() ,
			'name' : req.body.name,
			'contactNumber' : req.body.contactNumber,
			'username' : req.body.username,
			'companyName' : req.body.companyName,
			'order' : req.body.data
			}).getInformation();
			
			var record = new orderSchema(temp);

			record.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status: 'failure'});
				} else {
					res.json({status: 'success'});
				}
			});
			res.redirect('/');
		}
	};	
	
	functions.register = function(req, res) {
		//add condition to check for admins login
		res.render('register', {title: 'Register'});
	
	};

	functions.addUser = function(req, res, next) {
	  console.log('registering user');
	  userSchema.register(new userSchema({
	   		'userID' : timeStamp('USER'),
			'firstName' : req.body.firstName,
			'lastName' : req.body.lastName,
			username : req.body.username,
			password : req.body.password,
			'contactNumber' : req.body.contactNumber,
			'company' : req.body.company,
			'orderID' : null
	    }),
	  	req.body.password, function(err) {
	    	if (err) { 
	    		console.log('error while user register!', err);
	    		return next(err);
	    	}

	    	console.log('user registered!');

	    res.redirect('/');
	  });
	};	

	functions.login = function(req, res) {
		if (isLoggedIn(req)) {
			res.render('login', {title: 'Log in'});
		} else {
			res.redirect('/');
		}
	};

	function isLoggedIn(req){
		if (req.session.passport.user === undefined) {
			//change to true when require login
			return true;
		}else{
			return false;
		}
	};

	function timeStamp(prefix) {
		// Create a date object with the current time
		var now = new Date();
		var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
		var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
		
		date[1] = (date[1]<10)? '0'+date[1] : date[1];
		date[0] = (date[0]<10)? '0'+date[0] : date[0];

		time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
		time[0] = time[0] || 12;
		 
		for ( var i = 1; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = "0" + time[i];
			}
		}
		return prefix+date.join("") + time.join("");
	};

	return functions;
};
