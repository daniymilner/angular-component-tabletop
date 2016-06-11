(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('tableCtrl', [
			'$scope',
			'galleryFactory',
			'tableFactory',
			function($scope, Gallery, Table){
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
					$scope.$emit('toggle');
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
				};

				this.checkColumn = function(item_index, company_index){
					console.log(that.active);
					that
						.data
						.companies[company_index]
						.components.forEach(function(component){
							component.versions[item_index].checked = !component.versions[item_index].checked;
							that.toggle(component.versions[item_index], that.data.companies[company_index].company_name);
						});
				};

				this.checkRow = function(item_index, company_index){
					that
						.data
						.companies[company_index]
						.components[item_index].versions.forEach(function(componentVersion){
							componentVersion.checked = !componentVersion.checked;
							that.toggle(componentVersion, that.data.companies[company_index].company_name);
						});
				}
			}
		])
})();