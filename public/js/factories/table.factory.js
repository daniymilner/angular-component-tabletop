(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.factory('tableFactory', [
			function(){
				var that = this,
					checkVersion = function(version){
						return that.selected.some(function(item){
							return item.version === version
						});
					},
					getElementIndexByExpression = function(array, item, expression){
						return array.map(function(_item, index){
							if(_item[expression] == item){
								return index
							}
							return -1
						}).filter(function(item){
							return item > -1;
						})[0]
					},
					checkCompany = function(companies, company){
						return companies.some(function(item){
							return item.name === company
						});
					},
					elementExist = function(version, company, component){
						var versionIndex = getElementIndexByExpression(that.selected, version, 'version'),
							companyIndex;
						if(that.selected.length && versionIndex > -1){
							companyIndex = getElementIndexByExpression(that.selected[versionIndex].companies, company, 'name');
							if(companyIndex > -1){
								return that.selected[versionIndex].companies[companyIndex].components.some(function(_component){
									return _component.id === component;
								});
							}
							return false
						}
						return false;
					},
					checkElement = function(item, company){
						if(!checkVersion(item.version)){
							that.selected.push({
								version: item.version,
								companies: [].concat([{
									name: company,
									components: [item.data]
								}])
							});

						}else{
							var index = getElementIndexByExpression(that.selected, item.version, 'version');

							if(checkCompany(that.selected[index].companies, company)){
								that.selected[index].companies[getElementIndexByExpression(that.selected[index].companies, company, 'name')].components.push(item.data)
							}else{
								that.selected[index].companies.push({
									name: company,
									components: [].concat([item.data])
								})
							}

						}
					},
					uncheckElement = function(item, company){
						var versionIndex = getElementIndexByExpression(that.selected, item.version, 'version'),
							companyIndex = getElementIndexByExpression(that.selected[versionIndex].companies, company, 'name'),
							componentIndex = getElementIndexByExpression(that.selected[versionIndex].companies[companyIndex].components, item.data.id, 'id');

						that.selected[versionIndex].companies[companyIndex].components.splice(componentIndex, 1);
					};

				this.getClearedSelectedList = function(){
					this.selected = this.selected.filter(function(version){
						return version.companies.length && version.companies.filter(function(company){
								return company.components.length;
							}).length;
					});
					return this.selected;
				};

				this.selected = [];

				this.toggle = function(item, company){
					if(!elementExist(item.version, company, item.data.id)){
						checkElement(item, company);
					}else{
						uncheckElement(item, company);
					}
				};

				return this;
			}
		]);
})();