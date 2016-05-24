var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	Q = require('q');

module.exports = function(req, res){
	var galleryPath = path.join(__dirname, '../../component-gallery'),
		excluded = ['.git'],
		result = [];

	function checkIsDirectory(contentPath){
		return fs.lstatSync(contentPath).isDirectory();
	}

	function getEwizardVersions(){
		var deferrer = Q.defer();
		fs.readdir(galleryPath, function(err, content){
			if(!err){
				result = content.filter(function(item){
					return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, item));
				}).map(function(item){
					return {
						type: 'ewizardVersion',
						name: item,
						company: []
					}
				});
				deferrer.resolve();
			}else{
				deferrer.reject(err);
			}
		});
		return deferrer.promise;
	}

	function getCompanies(){
		var deferrer = Q.defer();
		async.each(result, function(version, cb){
			var versionPath = path.join(galleryPath, version.name);
			fs.readdir(versionPath, function(err, content){
				version.company = content.filter(function(item){
					return checkIsDirectory(path.join(versionPath, item));
				}).map(function(item){
					return {
						type: 'company',
						name: item,
						components: []
					}
				});
				cb();
			})
		}, function(err){
			if(!err){
				deferrer.resolve();
			}else{
				deferrer.reject();
			}
		});
		return deferrer.promise;
	}

	function getComponents(){
		var deferrer = Q.defer();
		async.each(result, function(version, callback){
			async.each(version.company, function(company, cb){
				var companyPath = path.join(galleryPath, version.name, company.name);
				fs.readdir(companyPath, function(err, content){
					company.components = content.filter(function(item){
						return checkIsDirectory(path.join(companyPath, item));
					}).map(function(item){
						return {
							type: 'component',
							name: item
						}
					});
					cb();
				})
			}, function(){
				callback();
			});
		}, function(err){
			if(!err){
				deferrer.resolve();
			}else{
				deferrer.reject();
			}
		});
		return deferrer.promise;
	}

	getEwizardVersions()
		.then(function(){
			return getCompanies();
		})
		.then(function(){
			return getComponents();
		})
		.then(function(){
			res.json(result);
		});

};