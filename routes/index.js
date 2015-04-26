
/*
 * GET home page.
 */

var feedbackSchema = require('../models/feedback');
var menuSchema = require('../models/menu');
var orderSchema = require('../models/order');
var userSchema = require('../models/user');
module.exports = function (passport) {
	var feed = require('../feedback');
	var order =require('../order');
	var user =require('../user');
	var functions = {};
	
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
			{'title':req.body.feedbackID,
			'feedback':req.body.feedback,
			'rating':req.body.rating,
			'timestamp': timeStamp(''),
			userID: req.user.userID}
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
			menuSchema.find({'isVisible':true})
			.setOptions({sort: 'comboID'})
			.exec(function(err, combos) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					var message=req.session.message;
					var alert=req.session.alert;
					req.session.message=null;
					req.session.alert=null;
					console.log(combos);
					res.render('menu', {
						title: 'Welcome!',
						message: message,
						alert: alert,
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
		var count={},orders={}, userOrders = {};
		var now = date(5.5);
		var lower = queryBuilderAdmin(now);
		console.log(timeStampCustom(lower,'000001')+"-"+timeStampForTime(now));
		if (isLoggedIn(req) && req.user.isAdmin) {
			orderSchema.find({'company' : req.user.company,'timestamp': { $gt: timeStampCustom(lower,'000001'),$lt: timeStampForTime(now) }})
			.setOptions({sort: 'timestamp'})
			.exec(function(err, order) {
				if (err) {
					res.status(500).json({status: 'failure'});
				} else {
					for ( var index in order ){
						var preferance =order[index];
						if(preferance.order != undefined){
							var arr = preferance.order.split(',');
							if (userOrders[arr[0]] == undefined){
								userOrders[arr[0]]={};
								userOrders[arr[0]][preferance.fullName]=preferance.contactNumber;
							} else {
								userOrders[arr[0]][preferance.fullName]=preferance.contactNumber;
							}
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
							res.render('admin', {
								title: 'Hello Admin',
								user: req.user,
								feeds: feeds,
								orderCount: count,
								orderList: userOrders
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
		if (isLoggedIn(req)) {
			var today = date(5.5);
			var upper = queryBuilderOrder(today);
			console.log(timeStampForTime(today)+' < '+timeStampCustom(upper,'210000'));
			if( timeStampForTime(today) <= timeStampCustom(upper,'210000')){
				var time= timeStamp('');
				console.log(req.body.data);
				//console.log(req.body.data);
				var temp = order(
				{
				'timestamp' : time ,
				userID : req.user.userID,
				'fullName' : req.user.firstName + ' ' + req.user.lastName,
				'contactNumber' : req.user.contactNumber,
				'order' : req.body.data,
				company : req.user.company
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
				orderSchema.remove({ timestamp: req.user.orderID },
									function(err, order) {
									    if (err) {
									      return res.send(err);
									    }
									 console.log('Successfully deleted order'+order );
									  });

				var conditions = { _id: req.user._id };
				var update = { $set: { orderID:  time}};
				var options = { upsert: true };

				userSchema.update(conditions, update, options, function(err, num, n){
				    if(err){
				        throw err;
				    }
				    console.log("updated order to timestamp "+time);
				});
				req.session.message='Your order has been placed. You can change it by ordering again. Have a good day!';
			}
			else {
				req.session.alert='Orders are only taken till 9:00 pm . Apologies for the Inconvenience !';
			}
			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	};	
	
	functions.cancelOrder = function( req, res){
		if (isLoggedIn(req)) {
			var today = date(5.5);
			var upper = queryBuilderOrder(today);
			console.log(timeStampForTime(today)+' < '+timeStampCustom(upper,'210000'));
			if( timeStampForTime(today) <= timeStampCustom(upper,'210000')){
				orderSchema.remove({ timestamp: req.user.orderID },
									function(err, order) {
									    if (err) {
									      return res.send(err);
									    }
									 console.log('Successfully deleted order'+order );
									  });
				var conditions = { _id: req.user._id };
				var update = { $set: { orderID:  null}};
				var options = { upsert: true };

				userSchema.update(conditions, update, options, function(err, num, n){
				    if(err){
				        throw err;
				    }
				    console.log("cancelled order");
				});
				req.session.alert='Your order has been cancelled';
			}
			else{
				req.session.alert='Orders are only taken till 9:00 pm . Apologies for the Inconvenience !';
			}
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
			return false;
		}else{
			return true;
		}
	};

	function timeStamp(prefix) {
		// Create a date object with the current time
		var today = new Date();
		var ms = today.getTime() + 19800000;
		var now = new Date(ms);

		var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate()];
		var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
		
		date[1] = (date[1]<10)? '0'+date[1] : date[1];
		date[2] = (date[2]<10)? '0'+date[2] : date[2];

		time[0] = ( time[0] < 10 ) ? ('0'+time[0]):time[0] ;
		 
		for ( var i = 1; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = "0" + time[i];
			}
		}
		return prefix+date.join("") + time.join("");
	};
	function timeStampForTime(now) {
		// Create a date object with the current time
		var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate()];
		var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
		
		date[1] = (date[1]<10)? '0'+date[1] : date[1];
		date[2] = (date[2]<10)? '0'+date[2] : date[2];

		time[0] = ( time[0] < 10 ) ? ('0'+time[0]):time[0] ;
		 
		for ( var i = 1; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = "0" + time[i];
			}
		}
		return date.join("") + time.join("");
	};
	function timeStampCustom(now,time) {
		// Create a date object with the current time

		var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate()];
		
		date[1] = (date[1]<10)? '0'+date[1] : date[1];
		date[2] = (date[2]<10)? '0'+date[2] : date[2];

		return date.join("") + time;
	};

	return functions;
};
function date(hours){
	var now= new Date();
	var time = new Date(now.getTime()+(hours*3600000));
	return time;
}
function queryBuilderOrder(now){
	var upper;
	switch(now.getDay()) {
	    case 5:
	    	var d = date(2*24);
	    	d.setHours(21);
	    	d.setMinutes(00);
	        upper = d;
	        break;
	    case 6:
	        var d = date(24);
	    	d.setHours(21);
	    	d.setMinutes(00);
	        upper = d;
	        break;
	    default:
	        var d = date(0);
	    	d.setHours(21);
	    	d.setMinutes(00);
	        upper = d;
	}
	return upper;
}
function queryBuilderAdmin(now){
	var lower;
	switch(now.getDay()) {
	    case 6:
	        var d = date(-18.5);
	    	d.setHours(11);
	    	d.setMinutes(00);
	        lower = d;
	        break;
	    case 0:
	        var d = date(-42.5);
	    	d.setHours(11);
	    	d.setMinutes(00);
	        lower = d;
	        break;
	    default:
	        now.setHours(11);
	        now.setMinutes(00);
	        lower = now;
	}
	return lower;
}