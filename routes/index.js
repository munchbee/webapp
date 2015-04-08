
/*
 * GET home page.
 */

/*
	req.session.passport.admin --> aweganic admins
	req.session.passport.user --> company admins
	req.session.passport.customer --> individual customers
*/

var feedbackSchema = require('../schemas/feedback');
var menuSchema = require('../schemas/menu');
var orderSchema = require('../schemas/order');

module.exports = function () {
	var feed = require('../feedback');
	var order =require('../order');
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
			res.render('feedback', {title: 'Feedback'});
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
						menu: combos,
						lastNumber: req.session.lastNumber
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
			'emailID' : req.body.emailID,
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
			return false;
		}else{
			return false;
		}
	};

	function timeStamp() {
		// Create a date object with the current time
		var now = new Date();
		 
		// Create an array with the current month, day and time
		var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
		 
		// Create an array with the current hour, minute and second
		var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
		 
		date[1] = (date[1]<10)? '0'+date[1] : date[1];

		date[0] = (date[0]<10)? '0'+date[0] : date[0];

		// Convert hour from military time
		time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
		 
		// If hour is 0, set it to 12
		time[0] = time[0] || 12;
		 
		// If seconds and minutes are less than 10, add a zero
		for ( var i = 1; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = "0" + time[i];
			}
		}
			 
			// Return the formatted string
		return "BLR"+date.join("") + time.join("");
	};

	return functions;
};
