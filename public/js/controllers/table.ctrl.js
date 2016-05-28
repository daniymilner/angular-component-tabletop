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
						if(that.data.companies.length){
							that.active = that.data.companies[0].company_name;
						}
					})
					.error(console.error);

				this.toggle = function(item, company){
					Table.toggle(item, company);
				};

				this.setActive = function(name){
					this.active = name;
				};

				this.getIndex = function(name){
					for(var i = 0; i < that.data.companies.length; i++){
						if(that.data.companies[i].company_name === name){
							return i;
						}
					}
					return 0;
				}
			}
		])
})();