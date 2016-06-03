var async = require('async'),
	path = require('path'),
	utils = require('../utils'),
	zipper = require('zipper'),
	Q = require('q');

function copyData(folderHash, data){
	var deferred = Q.defer(),
		tmpPath = path.join(__dirname, '../../.tmp'),
		galleryPath = path.join(__dirname, '../../component-gallery'),
		rootTmpFolder = path.join(tmpPath, folderHash);
	console.log(data);
	if(data.length){
		async.map(data, function(version, version_cb){
			var pathToVersion = path.join(rootTmpFolder, version.version);
			utils
				.mkdir(pathToVersion)
				.then(function(){
					async.each(version.companies, function(company, company_cb){
						async.each(company.components, function(component, component_cb){
							var pathToComponent = path.join(pathToVersion, component.id);
							utils.mkdir(pathToComponent)
								.then(function(){
									utils.cp(path.join(galleryPath, version.version, company.name, component.id), pathToComponent)
										.then(function(){
											component_cb();
										})
										.catch(function(err){
											component_cb(err);
										});
								});
						}, function(err){
							company_cb(err);
						});
					}, function(err){
						version_cb(err, path.join('.tmp', folderHash, version.version));
					});
				});
		}, function(err, res){
			if(!err){
				deferred.resolve(res);
			}else{
				deferred.reject(err);
			}
		});
	}else{
		deferred.reject()
	}

	return deferred.promise;
}

function createZip(directories){
	var deferred = Q.defer(),
		destPath = '.download/';
	async.map(directories, function(dir, cb){
		var pathToFile = destPath + utils.genDynHash(4) + '.zip';
		zipper.zip({
			src: dir,
			dest: pathToFile
		}, function(err){
			cb(err, pathToFile);
		});
	}, function(err, res){
		if(!err){
			deferred.resolve(res);
		}else{
			deferred.reject(err)
		}
	});

	return deferred.promise;
}

function clearTemp(folderHash){
	return utils.rm(path.join(__dirname, '../../.tmp', folderHash));
}

function copyArchives(folderHash, archives){
	var deferred = Q.defer(),
		zipSrc = path.join('.download/packs/', folderHash),
		destZip = path.join('.download/packs/', utils.genDynHash(4) + '.zip'),
		downloadPath = path.join(__dirname, '../../', zipSrc);
	if(!archives.length){
		deferred.reject();
	}else if(archives.length === 1){
		deferred.resolve(archives[0]);
	}else{
		utils.mkdir(downloadPath)
			.then(function(){
				async.each(archives, function(archive, cb){
					utils.cp(archive, path.join(downloadPath, utils.genDynHash(3) + '.zip'))
						.then(function(){
							utils.rm(archive);
							cb()
						})
						.catch(function(err){
							cb(err);
						});
				}, function(err){
					if(!err){
						zipper.zip({
							src: zipSrc,
							dest: destZip
						}, function(err){
							utils.rm(downloadPath);
							err ? deferred.reject(err) : deferred.resolve(destZip);
						});
					}else{
						deferred.reject(err);
					}
				});
			});
	}

	return deferred.promise;
}

exports.createZip = function(data, storeData){
	var deferrer = Q.defer(),
		folderHash = utils.genDynHash(3);

	copyData(folderHash, data)
		.then(function(directories){
			return createZip(directories)
		})
		.then(function(files){
			if(!storeData){
				clearTemp(folderHash);
			}
			deferrer.resolve(files);
		})
		.catch(deferrer.reject);
	return deferrer.promise;
};

exports.createZipPack = function(data){
	var folderHash = utils.genDynHash(3);
	return exports.createZip(data, true)
		.then(function(archives){
			return copyArchives(folderHash, archives)
		})
};