(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('mainCtrl', [
			'$mdDialog',
			'$mdMedia',
			'galleryFactory',
			'$scope',
			function($mdDialog, $mdMedia, Gallery, $scope){
				var that = this;

				this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

				this.showPublishPopup = function(event){
					var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
					$mdDialog
						.show({
							controller: ['$mdDialog', function($mdDialog){
								this.data = {
									instance: '',
									login: '',
									password: ''
								};
								this.cancel = function(){
									$mdDialog.cancel();
								};
								this.send = function(){
									if(this.data.instance && this.data.login && this.data.password){
										$mdDialog.hide(this.data);
									}
								};
							}],
							controllerAs: 'dialog',
							templateUrl: 'views/dialog/publish-dialog',
							parent: angular.element(document.body),
							targetEvent: event,
							clickOutsideToClose: false,
							fullscreen: useFullScreen
						})
						.then(function(data){
							Gallery
								.publish({
									userdata: data
								})
								.success(function(data){
									console.log(data);
								})
								.error(console.error);
						}, function(){
							console.log('cancel dialog');
						});

					$scope.$watch(function(){
						return $mdMedia('xs') || $mdMedia('sm');
					}, function(wantsFullScreen){
						that.customFullscreen = !!wantsFullScreen;
					});
				};
			}
		])
})();