var fs = require('fs-extra'),
	Q = require('q'),
	path = require('path'),
	objectAssign = require('object-assign');

exports.readJSON = function(pathSrc, options, cb){
	var deferred = Q.defer(),
		defaultOptions = {
			isNew: true
		};
	pathSrc = path.normalize(pathSrc);
	options = objectAssign(defaultOptions, options);
	fs.readJson(pathSrc, function(err, data){
		if(err){
			if(options.isNew){
				data = {};
				callback(cb, null, data);
				deferred.resolve(data);
			}else{
				callback(cb, err);
				deferred.reject(err);
			}
		}else{
			callback(cb, null, data);
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

exports.readJSONSync = function(pathSrc){
	var data = {}, json;
	if(fs.existsSync(pathSrc)){
		json = fs.readFileSync(pathSrc, 'utf8');
		try{
			data = JSON.parse(json);
		}catch(e){
			console.log(e);
			data = {};
		}
	}
	return data;
};

exports.getAuthorizationHeader = function(token){
	return {Authorization: 'Bearer ' + token}
};