(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('mainCtrl', [
			'galleryFactory',
			function(Gallery){
				var that = this;
				Gallery
					.getGallery()
					.success(function(data){
						console.log(data);
					})
					.error(console.error)
			}
		])
})();