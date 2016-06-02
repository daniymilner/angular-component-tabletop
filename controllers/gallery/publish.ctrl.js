var eWizard = require('../../services').eWizard,
	modules = require('../../modules'),
	async = require('async'),
	Q = require('q');

module.exports = function(req, res){
	var eWizardUser;
	if(req.body.userdata && req.body.userdata.instance){
		eWizard
			.login(req.body.userdata)
			.then(function(response){
				eWizardUser = response;
				delete eWizardUser.presentations;
				return modules.archive.createZip(req.body.selectedList);
			})
			.then(function(pathToZip){
				if(Array.isArray(pathToZip)){
					var deferrer = Q.defer();
					async.mapSeries(pathToZip, function(zipPath, cb){
						eWizard
							.publish(req.body.userdata.instance, eWizardUser.access_token, zipPath)
							.then(function(){
								cb();
							})
							.catch(function(err){
								cb(err);
							})
					}, function(err){
						if(!err){
							deferrer.resolve();
						}else{
							deferrer.reject(err);
						}
					});
					return deferrer.promise;
				}else{
					return eWizard.publish(req.body.userdata.instance, eWizardUser.access_token, pathToZip)
				}
			})
			.then(function(){
				return eWizard.logout(req.body.userdata.instance, eWizardUser.access_token);
			})
			.then(function(){
				res.sendStatus(200);
			})
			.catch(function(err){
				console.log(err);
				res.sendStatus(409);
			});
	}else{
		res.sendStatus(409);
	}
};