var User = function () {
	this.data = {
		userID : null,
		firstName : null,
		lastName : null,
		username : null,
		password : null,
		contactNumber : null,
		company : null,
		orderID : null
	};

	this.fill = function (info) {
		for(var prop in this.data) {
			if(this.data[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
	};

	this.getInformation = function () {
		return this.data;
	};
};

module.exports = function (info) {
	var instance = new User();

	instance.fill(info);

	return instance;
};
