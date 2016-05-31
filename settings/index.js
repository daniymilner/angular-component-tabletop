var express = require("express"),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	path = require('path'),
	rootPath = path.dirname(require.main.filename);

module.exports = function(app){
	app.set('views', path.join(rootPath, 'views'));
	app.use(express.static(path.join(rootPath, 'public')));
	app.set('view engine', 'jade');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(logger('dev'));
	app.use('/', require('../routes'));

	require('./db');
};