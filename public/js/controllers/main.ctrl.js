(function(){
	"use strict";

	angular
		.module('angular-component-tabletop')
		.controller('mainCtrl', [
			'$mdDialog',
			'$mdMedia',
			'galleryFactory',
			'tableFactory',
			'$scope',
			function($mdDialog, $mdMedia, Gallery, Table, $scope){
				var that = this;

				this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

				this.showPublishPopup = function(event){
					var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
					$mdDialog
						.show({
							controller: ['$mdDialog', function($mdDialog){
								this.data = {
									instance: 'http://192.168.0.212:3000',
									login: 'system',
									password: 'pass4ewizard!'
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
								.error(function(err){
									console.error(err);
								});
						}, function(){
							console.log('cancel dialog');
						});

					$scope.$watch(function(){
						return $mdMedia('xs') || $mdMedia('sm');
					}, function(wantsFullScreen){
						that.customFullscreen = !!wantsFullScreen;
					});
				};

				this.getChecked = function(){
					console.log(Table.selected);
				}
			}
		])
})();