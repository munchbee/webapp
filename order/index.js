var Order = function () {
	this.data = {
		timestamp : null,
		userID : null,
		fullName : null,
		contactNumber : null,
		order : null,
		company : null
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
	var instance = new Order();

	instance.fill(info);

	return instance;
};
