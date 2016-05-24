(function(){
	"use strict";

	angular
		.module('angular-component-tabletop', [])
		.factory('galleryFactory', [
			'$http',
			function($http){
				this.getGallery = function(){
					return $http.get('/gallery/get-data');
				};
				return this;
			}
		])
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