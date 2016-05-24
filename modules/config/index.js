var config = require('./config.json');

exports.get = function(key){
	return config[key];
};