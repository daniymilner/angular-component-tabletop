(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.factory('galleryFactory', [
			'$http',
			function($http){
				this.getGallery = function(){
					return $http.get('/gallery/get-data');
				};
				this.publish = function(data){
					return $http.post('/gallery/publish', data);
				};
				this.getZip = function(data){
					return $http.post('/gallery/get-zip', data)
				};
				return this;
			}
		])
})();