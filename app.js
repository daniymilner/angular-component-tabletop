var modules = require('./modules'),
	express = require('express');

modules
	.config
	.init()
	.then(function(){
		return modules.sync();
	})
	.then(function(database){
		var app = express(),
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