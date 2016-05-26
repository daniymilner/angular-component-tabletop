var request = require('request'),
	Q = require('q'),
	url = require('url');

module.exports = function(credential){
	var deferrer = Q.defer();
	request
		.post(url.resolve(credential.instance, '/user/login'), {
			form: {
				clientId: 'WebApp',
				login: credential.login,
				password: credential.password
			}
		}, function(err, res, body){
			var response = {};
			if(!err && body){
				try{
					response = JSON.parse(body);
					if(!response.err){
						deferrer.resolve(response);
					}else{
						deferrer.reject(response.err);
					}
				}
				catch(e){
					deferrer.reject(e);
				}
			}else{
				deferrer.reject(err);
			}
		});
	return deferrer.promise;
};