var Q = require('q'),
	modules = require('../../modules'),
	mongoose = require('mongoose'),
	exportSchema = new mongoose.Schema({
		type: String,
		status: {type: String, default: 'inprogress'},
		build_id: {type: String},
		options: {},
		created_at: {type: Date, default: Date.now},
		updated_at: {type: Date, default: Date.now}
	});

exportSchema.pre('save', function(next){
	this.updated_at = Date.now();
	next();
});

module.exports = exportSchema;