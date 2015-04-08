var Order = function () {
	this.data = {
		orderID : null,
		name : null,
		contactNumber : null,
		emailID : null,
		companyName : null,
		order : null
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
