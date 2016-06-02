var fs = require('fs-extra'),
	Q = require('q'),
	path = require('path'),
	objectAssign = require('object-assign');

function callback(cb, err, data){
	if(cb){
		cb(err, data);
	}
}

function callbackResult(cb, err, deferred, data){
	if(err){
		callback(cb, err);
		deferred.reject(err);
	}else{
		callback(cb, null, data);
		deferred.resolve(data);
	}
}

function s4(){
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

exports.genDynHash = function(length){
	var i = length || 1,
		hash = '';
	for(; i > 0; i--, hash += s4()){}
	return hash;
};
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

exports.mv = function(pathSrc, pathDest, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);
	pathDest = path.normalize(pathDest);
	fs.move(pathSrc, pathDest, function (err){
		callbackResult(cb, err, deferred);
	});
	return deferred.promise;
};

exports.mvIfExists = function(pathSrc, pathDest, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);
	pathDest = path.normalize(pathDest);

	exports
		.exists(pathSrc)
		.then(function(exist){
			if(exist){
				exports.mv(pathSrc, pathDest, function(err){
					callbackResult(cb, err, deferred);
				});
			}else{
				callback(cb);
				deferred.resolve();
			}
		});
	return deferred.promise;
};

exports.cpIfExists = function(pathSrc, pathDest, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);
	pathDest = path.normalize(pathDest);

	exports
		.exists(pathSrc)
		.then(function(exist){
			if(exist){
				exports.cp(pathSrc, pathDest, function(err){
					callbackResult(cb, err, deferred);
				});
			}else{
				callback(cb);
				deferred.resolve();
			}
		});
	return deferred.promise;
};

exports.rm = function(pathSrc, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);
	if(fs.existsSync(pathSrc)){
		fs.remove(pathSrc, function (err){
			callbackResult(cb, err, deferred);
		});
	}else{
		callbackResult(cb, null, deferred);
	}
	return deferred.promise;
};

exports.cp = function(pathSrc, pathDest, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);
	pathDest = path.normalize(pathDest);

	fs.copy(pathSrc, pathDest, function (err){
		callbackResult(cb, err, deferred);
	});
	return deferred.promise;
};

exports.mkdir = function(pathSrc, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);
	fs.mkdirs(pathSrc, function (err){
		callbackResult(cb, err, deferred);
	});
	return deferred.promise;
};

exports.readDirAsync = function(pathSrc, cb){
	var deferred = Q.defer();
	pathSrc = path.normalize(pathSrc);

	fs.readdir(pathSrc, function(err, files){
		callbackResult(cb, err, deferred, files);
	});

	return deferred.promise;
};

exports.isDirectory = function(src){
	var stats = fs.lstatSync(src);
	return stats.isDirectory();
};