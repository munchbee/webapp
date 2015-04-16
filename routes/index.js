
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
			res.render('feedback', {title: 'Feedback', user: req.user});
		} else {
			res.redirect('/login');
		}
	};

	functions.postFeedback = function(req, res) {
		//add condition to check for admins login
		
		if (isLoggedIn(req)) {
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
		} else {
			res.redirect('/login');
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
		} else {
			res.redirect('/login');
		}
	};

	functions.admin = function(req, res) {
		if (isLoggedIn(req) && req.user.isAdmin) {
			orderSchema.find()
			.setOptions({sort: 'orderID'})
			.exec(function(err, order) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					var count={},orders={};
					for ( var index in order ){
						var preferance =order[index];
						if(preferance.order != undefined){
							var arr = preferance.order.split(',');
							for (var i =1 ; i <= arr.length ; i++ ){
								if ( count[arr[i-1]] == undefined ) {
									count[arr[i-1]] = {};
								}
								if ( count[arr[i-1]][i] == undefined ){
									count[arr[i-1]][i]=1;
								}else{
									count[arr[i-1]][i]++;
								}
							}
						}
					}
					feedbackSchema.find()
					.sort({'rating':-1})
					.exec(function(err, feeds) {
						if (err) {
							res.status(500).json({status: 'failure'});
						} else {
							console.log(count);
							res.render('admin', {
								title: 'Hello Admin',
								user: req.user,
								feeds: feeds,
								orderCount: count
							});
						}
					});
				}
			});
		} else {
			res.redirect('/login');
		}
	};

	functions.postOrder = function(req, res) {
		//add condition to check for admins login
		
		if (isLoggedIn(req)) {
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
		} else {
			res.redirect('/login');
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
			isAdmin : false,
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
			res.redirect('/');
		} else {
			res.render('login', {title: 'Log in'});
		}
	};

	function isLoggedIn(req){
		if (req.session.passport.user === undefined) {
			//change to true when require login
			return false;
		}else{
			return true;
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
