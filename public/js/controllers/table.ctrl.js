(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('tableCtrl', [
			'galleryFactory',
			function(Gallery){
				var that = this;

				this.companies = [];

				Gallery
					.getGallery()
					.success(function(data){
						that.data = data;
						console.log(data);
					})
					.error(console.error)

			}
		])
})();