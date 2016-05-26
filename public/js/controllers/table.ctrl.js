(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('tableCtrl', [
			'galleryFactory',
			function(Gallery){
				var that = this;

				Gallery
					.getGallery()
					.success(function(data){
						that.data = data;
					})
					.error(console.error)
			}
		])
})();