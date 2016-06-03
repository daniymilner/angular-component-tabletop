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
			'$mdToast',
			function($mdDialog, $mdMedia, Gallery, Table, $scope, $mdToast){
				var that = this;

				this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
				this.showButtons = false;

				this.showPublishPopup = function(event){
					var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && this.customFullscreen;
					$mdDialog
						.show({
							controller: ['$mdDialog', function($mdDialog){
								var ewizard_creds = localStorage.getItem('ewizard_creds') ? JSON.parse(localStorage.getItem('ewizard_creds')) : null;

								this.data = ewizard_creds || {
									instance: '',
									login: '',
									password: ''
								};
								this.cancel = function(){
									$mdDialog.cancel();
								};
								this.send = function(){
									if(this.data.instance && this.data.login && this.data.password){
										localStorage.setItem('ewizard_creds', JSON.stringify(this.data));
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
									userdata: data,
									selectedList: Table.getClearedSelectedList()
								})
								.success(function(){
									$mdToast.show(
										$mdToast.simple()
											.textContent('Published successfully!')
											.hideDelay(3000)
									);
								})
								.error(function(err){
									console.error(err);
									$mdToast.show(
										$mdToast.simple()
											.textContent('Something went wrong! Check your credentials, choose at least one component and try again later!')
											.hideDelay(3000)
									);
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

				$scope.$on('toggle', function(){
					that.showButtons = !!Table.getClearedSelectedList().length
				});

				this.getZip = function(){
					Gallery
						.getZip(Table.getClearedSelectedList())
						.then(function(res){
							if(res.data.file){
								document.location.href = '/download?file=' + encodeURIComponent(res.data.file) + '&name=components';
							}
						})
						.catch(function(err){
							console.warn(err);
							$mdToast.show(
								$mdToast.simple()
									.textContent('Something went wrong! Choose at least one component and try again later!')
									.hideDelay(3000)
							);
						})
				};
			}
		])
})();