var utils = require('../../modules/utils'),
	fs = require('fs'),
	path = require('path');

exports.get = function(req, res){
	var file = req.query.file, arr,
		name = req.query.name ? req.query.name : utils.genDynHash(3),
		filePath = path.join(__dirname, '../../', file),
		extname = path.extname(file),
		basename = path.basename(file, extname);

	if(file && fs.existsSync(filePath)){
		if (extname == '.zip'){
			arr = basename.split('-');
			arr[0] = name;
			name = arr.join('-');
		}
		name = name.substr(0, 240) + extname;
		res.setHeader('Content-disposition', "attachment; filename*=utf-8''" + encodeURIComponent(name));
		res.sendfile(filePath, function(err){
			console.log(err);
			res.sendStatus(200);
		});
	}else{
		res.send(404);
	}
};