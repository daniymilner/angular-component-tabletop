(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('tableCtrl', [
			'galleryFactory',
			'tableFactory',
			function(Gallery, Table){
				var that = this;

				Gallery
					.getGallery()
					.success(function(data){
						that.data = data;
					})
					.error(console.error);

				this.toggle = function(item, company){
					Table.toggle(item, company);
				};
			}
		])
})();