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
				return this;
			}
		])
})();