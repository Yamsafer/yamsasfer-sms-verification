	// Deez is the nickname for directives
	var Deez = angular.module('ysSmsVerification.directives', []);

	Deez.directive('ysSmsVerification', [
		'$templateCache', '$compile',
		function ($templateCache, $compile) {
			return {
				link: function (scope, iElement, attrs) {

				},
				controller: function ($scope, $timeout, smsService) {

					var that = this;

					// Holds view screens
					this.screens = {};
					// Add screen (called on intialization of screens)
					this.addScreen = function (name, scope) {
						that.screens[name] = scope;
					}
					// Set active screen
					this.activateScreen = function (name) {

						if (!that.screens[name]) {
							return 0;
						}

						// Turn off all other screens
						angular.forEach(that.screens, function (screen) {
								screen.active = false;
							})
							// Activate desiered screen
						that.screens[name].active = true;
					}

					$scope.$on('mobileNumber:success', function (e, data) {

						// Set scope phone number
						$scope.phoneNumber = data.phoneNumber;
						$scope.country = data.countryCode;

						// Activate code activation scren
						that.activateScreen('verificationCode');
						// Start timer
						$scope.$broadcast('timer-start');
					})

					$scope.$on('verificationCode:success', function (e, code) {
						// Set scope phone number
						$scope.code = code;
						// Activate code activation scren
						that.activateScreen('success');
					})

					$scope.$on('verificationCode:tryagain', function (e) {
						that.activateScreen('mobileNumber');
					})

				},
				link: function (scope, el, attrs) {
					// Get template
					var template = attrs.templateUrl ? ($templateCache.get(attrs.templateUrl)) :
						($templateCache.get('sms-verification.html'));
					el.html(template);
					// Compile with scope
					$compile(el.contents())(scope);
				},
				scope: true,
				transclude: true
			};
		}
	]);


	/*
	Responsible for
	1) Ensure valid input number
	2) Submit number to backend
	3) inform app of submission && response
	*/

	Deez.directive('mobileNumber', [
		'$templateCache', '$compile',
		function ($templateCache, $compile) {
			return {

				restrict: 'EA',
				require: '^ysSmsVerification',
				controller: function ($scope, $element, $attrs, smsService) {
					// Set active by default
					$scope.active = true;
					// Function called on submit.
					$scope.submitNumber = function (num) {

						var T = $('input[name="phoneNumber"]').intlTelInput("getSelectedCountryData");

						if ($scope.mobileNumberForm.$valid) {

							smsService.send(num).then(

							function (data) {
								if (data.status == "ok") {
									$scope.$emit('mobileNumber:success', {
										countryCode: T,
										phoneNumber: $scope.mobileNumberForm.phoneNumber.$viewValue
									})
								} else {
									$scope.fail = true;
									$scope.$emit('mobileNumber:fail');
								}

							},
							function (data) {
								$scope.fail = true;
								$scope.$emit('mobileNumber:fail');
							})
						}
					}
				},
				scope: true,
				link: function (scope, el, attrs, smsVerification) {
					// Get template
					var template = attrs.templateUrl ? ($templateCache.get(attrs.templateUrl)) :
						($templateCache.get('mobile-number.html'));
					// Set html
					template = '<div ng-show="active"> ' + template + ' </div>';
					el.html(template);
					// Compile with scope
					$compile(el.contents())(scope);

					smsVerification.addScreen('mobileNumber', scope);
				},
				transclude: true
			};
		}
	]);


	/*
	Responsible for
	1) Ensure valid code
	2) Submit code to backend
	3) inform app of submission && response
	4) Timer and try again
	*/

	Deez.directive('verificationCode', [
		'$templateCache', '$compile',
		function ($templateCache, $compile) {
			return {
				restrict: 'EA',
				require: '^ysSmsVerification',
				scope: {},
				transclude: true,
				controller: function ($scope, $element, $attrs) {

					$scope.submitCode = function (code) {
						var isValidForm = $scope.verificationCodeForm.$valid;
						isValidForm ? ($scope.$emit('verificationCode:success', $scope.verificationCodeForm
							.code.$viewValue)) : (console.log("INVALID CODE"));
					}

					$scope.timerFinished = function () {
						$scope.timeout = true;
						$scope.$emit('verificationCode:timeout', $scope);
						$scope.$apply();
					}

					$scope.tryAgain = function () {
						$scope.timeout = false;
						$scope.$emit('verificationCode:tryagain');
					}
				},
				link: function (scope, el, attrs, smsVerification) {
					// Get template
					var template = attrs.templateUrl ? ($templateCache.get(attrs.templateUrl)) :
						($templateCache.get('verification-code.html'));

					template = '<div ng-show="active"> ' + template + ' </div>';
					// Set html
					el.html(template);
					// Compile with scope
					$compile(el.contents())(scope);

					smsVerification.addScreen('verificationCode', scope);
				}
			};
		}
	]);
