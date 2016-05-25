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
						that.versions = data;
						console.log(data);

						that.companies = [].concat.apply([], data.map(function(version){
							return that.companies.concat(version.company.map(function(company){
								return company.name
							}));
						})).filter(function(item, index, array){
							return array.indexOf(item) == index;
						});

						console.log(that.companies);

					})
					.error(console.error)
			}
		])
})();