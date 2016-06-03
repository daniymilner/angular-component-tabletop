var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers');

router
	.get('/', function(req, res){
		res.render('index', {
			version: global.app.get('version')
		});
	})
	.get('/views/*', function(req, res){
		var path = req.url.replace(/(^\/views\/|\.html$)/gim, '');
		res.render(path);
	})
	.get('/download', controllers.Download.get)
	.get('/gallery/get-data', controllers.Gallery.get)
	.post('/gallery/publish', controllers.Gallery.publish)
	.post('/gallery/get-zip', controllers.Gallery.archive);

module.exports = router;
