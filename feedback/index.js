var Feedback = function () {
	this.data = {
		feedbackID : null,
		feedback : null,
		rating : null
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
