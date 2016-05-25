var Q = require('q');

module.exports = function(user){
	var deferrer = Q.defer();
	console.log(user);
	deferrer.resolve();
	return deferrer.promise;
};