var modules = require('../../modules');

module.exports = function(req, res){
	res.json(modules.config.getDatabase());
};