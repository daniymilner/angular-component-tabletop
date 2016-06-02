var modules = require('../../modules');

module.exports = function(req, res){
	modules
		.archive
		.createZipPack(req.body)
		.then(function(path){
			res.json({
				file: path
			})
		});
};