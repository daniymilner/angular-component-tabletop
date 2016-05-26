var path = require('path'),
	utils = require('../../modules/utils');

module.exports = function(req, res){
	utils
		.readJSON(path.join(__dirname, '../../database.json'))
		.then(function(result){
			res.json(result);
		})
		.catch(function(){
			res.sendStatus(409);
		})
};