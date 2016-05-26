var request = require('request'),
	Q = require('q'),
	utils = require('../../modules/utils'),
	url = require('url');

module.exports = function(instance, access_token){
	var deferrer = Q.defer();
	request
		.post({
			url: url.resolve(instance, '/user/logout'),
			headers: utils.getAuthorizationHeader(access_token)
		}, function(){
			deferrer.resolve();
		});
	return deferrer.promise;
};