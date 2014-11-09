	// Deez is the nickname for directives
	var Deez = angular.module('ysSmsVerification.directives', []);

	Deez.directive('ysSmsVerification', [
		'$templateCache', '$compile',
		function($templateCache, $compile) {
			return {
				link: function(scope, iElement, attrs) {

				},
				controller: function($scope, $timeout, smsService) {

					var that = this;

					$scope.smsVerificationData = {
						phoneNumber: null,
						country_code: null,
						code: null
					}

					// Holds view screens
					this.screens = {};
					// Add screen (called on intialization of screens)
					this.addScreen = function(name, scope) {
						that.screens[name] = scope;
					}
					// Set active screen
					this.activateScreen = function(name) {

						if (!that.screens[name]) {
							return 0;
						}

						// Turn off all other screens
						angular.forEach(that.screens, function(screen) {
							screen.active = false;
						})
						// Activate desiered screen
						that.screens[name].active = true;
					}

					$scope.$on('mobileNumber:success', function(e, data) {
						// Activate code activation scren
						that.activateScreen('verificationCode');
						// Start timer
						$scope.$broadcast('timer-start');
					})

					$scope.$on('verificationCode:success', function(e, data) {
						// Emit success event
						$scope.$emit('smsVerification:success',data);
						// set scope data
						$scope.smsVerificationData = data;
						// Activate code activation scren
						that.activateScreen('verificationSuccess');

					})

					$scope.$on('verificationCode:tryagain', function(e) {
						that.activateScreen('mobileNumber');
					})

				},
				link: function(scope, el, attrs) {
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
		function($templateCache, $compile) {
			return {
				restrict: 'EA',
				require: '^ysSmsVerification',
				controller: function($scope, $element, $attrs, smsService) {
					// Set active by default
					$scope.active = true;
					// Function called on submit.
					$scope.submitNumber = function(num) {

						if ($scope.mobileNumberForm.$valid) {
							// Construct number object
							var number = {};
							number.country_code = "+" + $('input[name="phoneNumber"]').intlTelInput("getSelectedCountryData").dialCode;
							number.phone_number = $scope.mobileNumberForm.phoneNumber.$viewValue.replace(number.country_code, "").replace(/\s+/g, '');

							// Set submitting phone flag to true obviously
							$scope.submittingPhone = true;

							// In case of success
							var submitSuccess = function(data) {

								if (data.status != "error") {

									smsService.dataAttr('phone_number', number.phone_number);
									smsService.dataAttr('country_code', number.country_code);

									// emit success event with number value
									$scope.$emit('mobileNumber:success', number);

								} else {
									// todo: handle error
								}

								$scope.submittingPhone = false;
							};

							// In case of failure
							var submitFail = function(data) {
								$scope.fail = true;
								$scope.$emit('mobileNumber:fail');
							};

							// Submit phone number
							smsService.send(number).then(submitSuccess, submitFail);

						} else {

						}



					}
				},
				scope: true,
				link: function(scope, el, attrs, smsVerification) {
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
		function($templateCache, $compile) {
			return {
				restrict: 'EA',
				require: '^ysSmsVerification',
				scope: {},
				transclude: true,
				controller: function($scope, $element, $attrs, smsService) {

					$scope.submitCode = function(code) {
						var isValidForm = $scope.verificationCodeForm.$valid;
						if (isValidForm) {

							var postData = {
									'phone_number': smsService.dataAttr('phone_number'),
									'country_code': smsService.dataAttr('country_code'),
									'code': code
								},
								success = function(data) {
									if (data.status != "verification failed") {
										$scope.$emit('verificationCode:success', postData)
									} else {
										// todo: display message that code is wrong
										console.log(data.message);
									}
								},
								fail = function(data) {
									console.log(data.error, data.message)
								}

							console.log(postData);

							smsService.verify(postData).then(success, fail);

						}
					}

					$scope.timerFinished = function() {
						$scope.timeout = true;
						$scope.$emit('verificationCode:timeout', $scope);
						$scope.$apply();
					}

					$scope.tryAgain = function() {
						$scope.timeout = false;
						$scope.$emit('verificationCode:tryagain');
					}
				},
				link: function(scope, el, attrs, smsVerification) {
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


	Deez.directive('verificationSuccess', [
		'$templateCache', '$compile',
		function($templateCache, $compile) {
			return {
				restrict: 'EA',
				require: '^ysSmsVerification',
				scope: {},
				transclude: true,
				link: function(scope, el, attrs, smsVerification) {
					// Get template
					var template = attrs.templateUrl ? ($templateCache.get(attrs.templateUrl)) :
						($templateCache.get('verification-success.html'));

					template = '<div ng-show="active"> ' + template + ' </div>';
					// Set html
					el.html(template);
					// Compile with scope
					$compile(el.contents())(scope);

					smsVerification.addScreen('verificationSuccess', scope);
				}
			};
		}
	])