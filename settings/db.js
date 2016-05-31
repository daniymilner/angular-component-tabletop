var mongoose = require('mongoose'), connection,
	config = require('../modules/config'),
	dbData = config.getDbData();

mongoose.connect('mongodb://' + dbData.host + '/' + dbData.database);
mongoose.set('debug', dbData.debug || false);

connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', function callback(){
	console.log('Connected to DB ' + dbData.database);
});

require('../models');