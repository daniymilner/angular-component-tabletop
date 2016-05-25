(function(){
	"use strict";

	angular
		.module('angular-component-tabletop', [
			'ngMaterial',
			'md.data.table'
		])
		.config(function($mdThemingProvider) {
			$mdThemingProvider.theme('default')
				.primaryPalette('indigo')
				.accentPalette('grey');
		});
})();