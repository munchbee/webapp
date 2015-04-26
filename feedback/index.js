var Feedback = function () {
	this.data = {
		title : null,
		feedback : null,
		rating : null,
		timestamp : null,
		userID : null,
		comboID : null
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
	var instance = new Feedback();

	instance.fill(info);

	return instance;
};
