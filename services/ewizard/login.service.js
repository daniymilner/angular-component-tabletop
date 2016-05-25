var request = require('request'),
	Q = require('q');

module.exports = function(credential){
	var deferrer = Q.defer();
	request
		.post(credential.instance + '/user/login', {form: {
			clientId: 'WebApp',
			login: credential.login,
			password: credential.password
		}}, function(err, res, body){
			var response = {};
			if(!err && body){
				try{
					response = JSON.parse(body);
					deferrer.resolve(response);
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