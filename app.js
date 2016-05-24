var express = require("express"),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	modules = require('./modules'),
	env = modules.config.get('env'),
	app = express(),
	path = require('path'),
	rootPath = path.dirname(require.main.filename);

app.set('views', path.join(rootPath, 'views'));
app.use(express.static(path.join(rootPath, 'public')));
app.set('view engine', 'jade');
app.set('modules', modules);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));
app.use('/', require('./routes'));

app.listen(env.port, function (){
	console.log('Start listen on port ' + env.port);
});