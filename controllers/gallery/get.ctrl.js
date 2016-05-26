var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	utils = require('../../modules/utils'),
	Q = require('q');

module.exports = function(req, res){
	var galleryPath = path.join(__dirname, '../../component-gallery'),
		excluded = ['.git'],
		result = [],
		versions = [];

	function checkIsDirectory(contentPath){
		return fs.lstatSync(contentPath).isDirectory();
	}

	function _getCompanies(){
		var deferred = Q.defer();

		fs.readdir(galleryPath, function(err, content){
			if(!err){
				async.map(content.filter(function(item){
					return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, item));
				}), function(version, callback){
					var versionPath = path.join(galleryPath, version);
					fs.readdir(versionPath, function(err, content){
						callback(err, content.filter(function(item){
							return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, version, item));
						}));
					});
				}, function(err, res){
					if(!err && res){
						result = [].concat.apply([], res).filter(function(item, index, array){
							return array.indexOf(item) == index;
						}).map(function(item){
							return {
								company_name: item,
								components: []
							}
						});

						deferred.resolve(result);
					}else{
						deferred.reject(err);
					}
				});
			}else{
				deferred.reject(err);
			}
		});

		return deferred.promise;
	}

	function _getComponents(){
		var deferred = Q.defer();

		fs.readdir(galleryPath, function(err, content){
			if(!err){
				async.map(content.filter(function(item){
					return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, item));
				}), function(version, callback){
					var versionPath = path.join(galleryPath, version);
					fs.readdir(versionPath, function(err, content){
						content = content.filter(function(item){
							return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, version, item));
						}).console.log(content);

					});
				}, function(err, res){

				});
			}else{
				deferred.reject(err);
			}
		});

		return deferred.promise;
	}

	function getEwizardVersions(){
		var deferred = Q.defer();
		fs.readdir(galleryPath, function(err, content){
			if(!err){
				result = versions = content.filter(function(item){
					return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, item));
				}).map(function(item){
					return {
						type: 'ewizardVersion',
						name: item,
						company: []
					}
				});
				deferred.resolve();
			}else{
				deferred.reject(err);
			}
		});
		return deferred.promise;
	}

	function getCompanies(){
		var deferred = Q.defer();
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
				deferred.resolve();
			}else{
				deferred.reject();
			}
		});
		return deferred.promise;
	}

	function getComponents(){
		var deferred = Q.defer();
		async.each(result, function(version, callback){
			async.each(version.company, function(company, cb){
				var companyPath = path.join(galleryPath, version.name, company.name);
				fs.readdir(companyPath, function(err, content){
					company.components = content.filter(function(item){
						return checkIsDirectory(path.join(companyPath, item));
					}).map(function(item){
						return {
							component_name: item,
							config: utils.readJSONSync(path.join(companyPath, item, 'config.json'))
						};
					});
					cb();
				})
			}, function(){
				callback();
			});
		}, function(err){
			if(!err){
				deferred.resolve();
			}else{
				deferred.reject();
			}
		});
		return deferred.promise;
	}

	function sortData(){
		var resultData = {
			versions: versions.map(function(item){
				return item.name
			}),
			companies: []
		},
			componentExist = function(array, item){
				return array.some(function(arr_item){
					return arr_item.name === item.component_name
				})
			},
			getComponentIndex = function(array, item){
				var index = null, i = 0;

				for(i; i<=array.length; i++){
					if(array[i].name === item.component_name){
						index = i;
						break;
					}
				}

				return index;
			},
			validVersion = function(version, company, component){
				var isValid = false;

				result.forEach(function(_version){
					if(_version.name === version){
						_version.company.forEach(function(_company){
							if(_company.name === company){
								isValid = _company.components.some(function(_component){
									return _component.component_name === component
								});
							}
						});
					}
				});

				return isValid;
			},
			versionExist = function(array, item){
				return array.some(function(arr_item){
					return arr_item.version === item
				})
			};

		resultData.companies = [].concat.apply([], result.map(function(version){
			return resultData.companies.concat(version.company.map(function(company){
				return company.name
			}));
		})).filter(function(item, index, array){
			return array.indexOf(item) == index;
		}).map(function(name){
			return {
				company_name: name,
				components: []
			};
		});

		resultData.companies.forEach(function(company){
			result.forEach(function(version){
				version.company.forEach(function(_company){
					if(_company.name === company.company_name){
						_company.components.forEach(function(_component){
							if(componentExist(company.components, _component)){
								company.components[getComponentIndex(company.components, _component)].versions.push({
									version: version.name,
									data: _component.config
								});
							}else{
								company.components.push({
									name: _component.component_name,
									versions: new Array({
										version: version.name,
										data: _component.config
									})
								})
							}
						});
					}
				});
			});
		});

		resultData.versions.forEach(function(version, version_index){
			resultData.companies.forEach(function(company){
				company.components.forEach(function(component){
					if(!validVersion(version, company.company_name, component.name) && !versionExist(component.versions, version)){
						component.versions.splice(version_index, 0, {
							version: version,
							data: {}
						})
					}
				});
			});
		});

		return resultData

	}

	getEwizardVersions()
		.then(function(){
			return getCompanies();
		})
		.then(function(){
			return getComponents();
		})
		.then(function(){
			res.json(sortData());
		});

};