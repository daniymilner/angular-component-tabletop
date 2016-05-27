var Utils = require('../utils'),
	objectAssign = require('object-assign'),
	Q = require('q'),
	path = require('path');

function Config(){
	this.configPath = path.join(__dirname, 'config.json');
	this.data = {};
}

Config.prototype.setData = function(data){
	this.data = objectAssign(this.data, data);
};

Config.prototype.getData = function(key){
	if(key){
		return this.data[key];
	}
	return this.data;
};

Config.prototype.getEnvData = function(){
	return this.getData('environment');
};

Config.prototype.getDatabase = function(){
	return this.getData('database');
};

Config.prototype.init = function(){
	var that = this,
		deferred = Q.defer();

	Utils
		.readJSON(this.configPath)
		.then(function(data){
			that.setData(data);
			deferred.resolve(that.data);
		})
		.catch(deferred.reject);

	return deferred.promise;
};

module.exports = new Config();