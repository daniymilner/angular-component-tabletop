var async = require('async'),
	path = require('path'),
	utils = require('../utils'),
	zipper = require('zipper'),
	Q = require('q');

function copyData(data){
	var deferred = Q.defer(),
		tmpPath = path.join(__dirname, '../../.tmp'),
		galleryPath = path.join(__dirname, '../../component-gallery');

	if(data.length){
		async.map(data, function(version, version_cb){
			var pathToVersion = path.join(tmpPath, version.version);
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
										});
								});
						}, function(){
							company_cb();
						});
					}, function(){
						version_cb(null, '.tmp/'+ version.version);
					});
				});
		}, function(err, res){
			deferred.resolve(res);
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
			cb(err, path.normalize(process.cwd() + path.sep + pathToFile));
		});
	}, function(err, res){
		clearTemp();
		if(!err){
			deferred.resolve(res);
		}else{
			deferred.reject(err)
		}
	});

	return deferred.promise;
}

function clearTemp(){
	var deferred = Q.defer(),
		tmpPath = path.join(__dirname, '../../.tmp');

	utils.readDirAsync(tmpPath)
		.then(function(entries){
			async.each(entries, function(entry, cb){
				var dirPath = path.join(tmpPath, entry);
				if(utils.isDirectory(dirPath)){
					utils.rm(dirPath)
						.then(cb)
				}else{
					cb(new Error());
				}
			}, function(err){
				if(!err){
					deferred.resolve();
				}else{
					deferred.reject();
				}
			});

		});

	return deferred.promise;
}

function copyArchives(archives){
	var deferred = Q.defer(),
		downloadPath = path.join(__dirname, '../../.download');

	if(archives.length){
		utils.mkdir(downloadPath + '/packs')
			.then(function(){
				async.each(archives, function(archive, cb){
					utils.cp(archive, downloadPath + '/packs')
						.then(function(){
							cb()
						});
				}, function(err){
					err ? deferred.reject(err) : deferred.resolve();
				});
			});
	}else{
		deferred.reject()
	}

	return deferred.promise;
}

exports.createZip = function(data){
	return copyData(data)
		.then(function(directories){
			return createZip(directories)
		})
};

exports.createZipPack = function(data){
	return exports.createZip(data)
		.then(function(archives){
			return copyArchives(archives)
		})
};