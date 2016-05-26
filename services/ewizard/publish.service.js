var request = require('request'),
	Q = require('q'),
	path = require('path'),
	fs = require('fs'),
	utils = require('../../modules/utils'),
	url = require('url');

module.exports = function(instance, access_token){
	var deferrer = Q.defer();
	request
		.post({
			url: url.resolve(instance, '/admin/api/components/upload'),
			headers: utils.getAuthorizationHeader(access_token),
			formData: {
				components: fs.createReadStream(path.join(__dirname, '../../.download/default.zip'))
			}
		}, function(err){
			if(!err){
				deferrer.resolve();
			}else{
				deferrer.reject(err);
			}
		});
	return deferrer.promise;
};