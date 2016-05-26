var eWizard = require('../../services').eWizard;

module.exports = function(req, res){
	var eWizardUser;
	if(req.body.userdata && req.body.userdata.instance){
		eWizard
			.login(req.body.userdata)
			.then(function(response){
				eWizardUser = response;
				delete eWizardUser.presentations;
				return eWizard.publish(req.body.userdata.instance, eWizardUser.access_token);
			})
			.then(function(){
				return eWizard.logout(req.body.userdata.instance, eWizardUser.access_token);
			})
			.then(function(){
				res.sendStatus(200);
			})
			.catch(function(){
				res.sendStatus(409);
			});
	}else{
		res.sendStatus(409);
	}
};