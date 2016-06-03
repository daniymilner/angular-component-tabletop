var modules = require('./modules'),
	express = require('express'),
	path = require('path');

modules
	.config
	.init()
	.then(function(){
		return modules.utils.rm(path.join(__dirname, '.tmp'));
	})
	.then(function(){
		return modules.utils.rm(path.join(__dirname, '.download'));
	})
	.then(function(){
		return modules.sync();
	})
	.then(function(database){
		var app = global.app = express(),
			envData = modules.config.getEnvData();

		modules.config.setData({database: database});

		require('./settings')(app);

		app.listen(envData.port, function(){
			console.log('Express server listening on port ' + envData.port);
		});
	})
	.catch(function(err){
		console.error(err.stack);
		throw new Error(err);
	});