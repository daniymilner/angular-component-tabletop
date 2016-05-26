var fs = require('fs-extra'),
	Q = require('q'),
	path = require('path'),
	objectAssign = require('object-assign');

exports.readJSON = function(pathSrc, options){
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
				deferred.resolve(data);
			}else{
				deferred.reject(err);
			}
		}else{
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

exports.writeJSONSync = function(pathDest, data, checkOnExist){
	if(!checkOnExist || fs.existsSync(pathDest)){
		fs.writeFileSync(pathDest, JSON.stringify(data, null, "\t"));
	}
};

exports.getAuthorizationHeader = function(token){
	return {Authorization: 'Bearer ' + token}
};