var eWizard = require('../../services').eWizard;

module.exports = function(req, res){
	if(req.body.userdata){
		eWizard
			.login(req.body.userdata)
			.then(function(response){
				res.json(response);
			})
			.catch(function(){
				res.sendStatus(409);
			});
	}else{
		res.sendStatus(409);
	}
};