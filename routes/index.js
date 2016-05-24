var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers');

router
	.get('/', function(req, res){
		res.render('index');
	})
	.get('/views/*', function(req, res){
		var path = req.url.replace(/(^\/views\/|\.html$)/gim, '');
		res.render(path);
	})
	.get('/gallery/get-data', controllers.Gallery.get);

module.exports = router;
