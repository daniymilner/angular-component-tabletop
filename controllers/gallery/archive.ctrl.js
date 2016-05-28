var modules = require('../../modules');

module.exports = function(req, res){
	modules
		.archive
		.createZip(req.body)
		.then(function(path){
			res.json(path)
		});
};