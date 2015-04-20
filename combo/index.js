var Combo = function () {
	this.data = {
		comboID : null,
		comboName : null,
		mainCourse : null,
		drinks : null,
		isVisible : false
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
	var instance = new Combo();

	instance.fill(info);

	return instance;
};
