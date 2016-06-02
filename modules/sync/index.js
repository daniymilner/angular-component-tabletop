module.exports = function(){
	var fs = require('fs'),
		path = require('path'),
		async = require('async'),
		utils = require('../utils'),
		Q = require('q'),
		galleryPath = path.join(__dirname, '../../component-gallery'),
		excluded = ['.git'],
		result = [],
		versions = [],
		deferred = Q.defer();

	function checkIsDirectory(contentPath){
		return fs.lstatSync(contentPath).isDirectory();
	}

	function temporaryExclude(item){
		return ['36', '41', 'application']. indexOf(item) === -1;
	}

	function getEwizardVersions(){
		var deferrer = Q.defer();
		fs.readdir(galleryPath, function(err, content){
			if(!err){
				result = versions = content.filter(function(item){
					return excluded.indexOf(item) === -1 && checkIsDirectory(path.join(galleryPath, item)) && temporaryExclude(item);
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
				deferrer.reject(err);
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
				deferrer.resolve();
			}else{
				deferrer.reject(err);
			}
		});
		return deferrer.promise;
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

				for(i; i <= array.length; i++){
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
			deferred.resolve(sortData());
		})
		.catch(function(err){
			deferred.reject(err);
		});

	return deferred.promise;
};
