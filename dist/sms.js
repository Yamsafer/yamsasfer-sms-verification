(function() {


// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('ysSmsVerification.config', [])
	.value('ysSmsVerification.config', {
		debug: true
	});


angular.module("internationalPhoneNumber", []).directive(
	'internationalPhoneNumber',
	function () {
		return {
			restrict: 'A',
			require: '^ngModel',
			//   scope: true,
			link: function (scope, element, attrs, ctrl) {

				var handleWhatsSupposedToBeAnArray, options, read;

				read = function () {
					return ctrl.$setViewValue(element.val());
				};

				handleWhatsSupposedToBeAnArray = function (value) {
					if (typeof value === "object") {
						return value;
					} else {
						return value.toString().replace(/[ ]/g, '').split(',');
					}
				};

				options = {
					autoFormat: true,
					autoHideDialCode: true,
					defaultCountry: '',
					nationalMode: false,
					numberType: '',
					onlyCountries: void 0,
					preferredCountries: ['us', 'gb'],
					responsiveDropdown: false,
					utilsScript: ""
				};

				angular.forEach(options, function (value, key) {
					var option;
					option = eval("attrs." + key);
					if (angular.isDefined(option)) {
						if (key === 'preferredCountries') {
							return options.preferredCountries = handleWhatsSupposedToBeAnArray(
								option);
						} else if (key === 'onlyCountries') {
							return options.onlyCountries = handleWhatsSupposedToBeAnArray(option);
						} else if (typeof value === "boolean") {
							return options[key] = option === "true";
						} else {
							return options[key] = option;
						}
					}
				});

				element.intlTelInput(options);

				scope.country = element.intlTelInput("getSelectedCountryData");

				if (!options.utilsScript) {
					element.intlTelInput('loadUtils',
						'bower_components/intl-tel-input/lib/libphonenumber/build/utils.js');
				}

				ctrl.$parsers.push(function (value) {
					if (!value) {
						return value;
					}
					return value.replace(/[^\d]/g, '');
				});

				ctrl.$parsers.push(function (value) {
					if (value) {
						ctrl.$setValidity('international-phone-number', element.intlTelInput(
							"isValidNumber"));
					} else {
						value = '';
						delete ctrl.$error['international-phone-number'];
					}
					return value;
				});

				element.on('blur keyup change', function (event) {
					return scope.$apply(read);
				});

				return element.on('$destroy', function () {
					return element.off('blur keyup change');
				});
			}
		};
	});

// Modules
angular.module('ysSmsVerification.directives', []);
angular.module('ysSmsVerification.filters', []);
angular.module('ysSmsVerification.services', []);
angular.module('ysSmsVerification.templates', []);
angular.module('ysSmsVerification', [
	'ysSmsVerification.config',
	'ysSmsVerification.directives',
	'ysSmsVerification.filters',
	'ysSmsVerification.services',
	'ysSmsVerification.templates',
	'ngSanitize',
	'internationalPhoneNumber',
	'timer'
]);

angular.module("ysSmsVerification.templates").run(["$templateCache", function($templateCache) {$templateCache.put("mobile-number.html","<form class=\"form-horizontal\" name=\"mobileNumberForm\" ng-submit=\'submitNumber(phoneNumber)\'>\n\n    <div class=\"form-group form-group-lg\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">Phone Number</label>\n        <div class=\"col-sm-5\">\n\n            <div ng-if=\"fail\" class=\"alert alert-danger text-center\">\n                Something went wrong, make sure you entered a valid phone number, or try a different one\n            </div>\n\n            <div class=\"form-group form-group-lg\">\n                <div class=\"col-sm-12\">\n                    <input class=\'form-control input-lg\' type=\"text\" preferred-countries=\"ps, sa,jo,kw\" responsive-dropdown=\'true\' default-country=\"ps\" international-phone-number name=\"phoneNumber\" ng-model=\"phoneNumber\" ng-required=\"true\" />\n                </div>\n            </div>\n            <div class=\"form-group form-group-lg\">\n                <div class=\"col-sm-12\">\n                    <button ng-disabled=\"submittingPhone\" type=\'submit\' class=\'btn btn-primary btn-block btn-lg\'>Send Me SMS\n                        <span ng-if=\"submittingPhone\"> <i class=\"fa fa-spinner fa-spin\"></i> \n                        </span>\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n            <p class=\"help-block\">\n                <strong>We will send you a verification code by SMS.</strong>\n                <br />You will need this code to confirm your booking.</p>\n        </div>\n    </div>\n</form>\n");
$templateCache.put("sms-verification.html","\n<mobile-number>\n</mobile-number>\n\n<verification-code>\n</verification-code>\n\n\n<verification-success>\n</verification-success>\n");
$templateCache.put("verification-code.html","<form class=\"form-horizontal\" name=\"verificationCodeForm\" ng-submit=\'submitCode(code)\'>\n    <div class=\"form-group form-group-lg\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">Verfication Code</label>\n        <div class=\"col-sm-5\">\n            <div class=\"form-group form-group-lg\">\n                <div class=\"col-sm-12\">\n                    <div class=\"input-group\">\n                        <input class=\'form-control\' type=\'text\' name=\"code\" ng-model=\'code\' ng-minlength=\"5\" ng-maxlength=\"7\" ng-required=\'true\' placeholder=\'_______ \' \n                        style=\"font-size: 30px;height: 70px;letter-spacing: 7px;font-family: monospace;text-align: center; color:black; \" />\n                        <span class=\"input-group-btn\">\n                            <a class=\"btn btn-default\" type=\"button\" style=\"padding: 14px 24px;font-size: 28px;color:black;\" disabled><i class=\"fa fa-lock\"></i>\n                            </a>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\'form-group form-group-lg\'>\n                <div class=\"col-sm-12\">\n                    <button type=\'submit\' class=\'btn btn-primary btn-block btn-lg\'>Complete Booking</button>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n            <p class=\"help-block\">\n                Your code is being delivered by SMS.\n                <br>This may take up to 2:30 minutes depending on your network operator.\n                <br>\n                <strong>\n                    <small>\n                        <timer autostart=\"false\" countdown=\"5\" max-time-unit=\"\'minute\'\" interval=\"1000\" finish-callback=\"timerFinished()\">{{mminutes}} minute{{minutesS}}, {{sseconds}} second{{secondsS}}</timer> <i class=\"fa fa-clock-o\"></i> passed.\n                    </small>\n                </strong>\n\n                <span class=\"text-center\" ng-show=\"timeout\">\n                    Didn\'t receive code ? <a ng-click=\"tryAgain()\" href=\"\">Try a different number</a>\n                </span>\n            </p>\n        </div>\n    </div>\n</form>");
$templateCache.put("verification-success.html","<form class=\"form-horizontal\">\n    <div class=\"form-group form-group-lg\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">Phone Number</label>\n        <div class=\"col-sm-5\">\n            <div class=\"form-group\">\n                <div class=\"col-sm-12\">\n                	<input type=\"text\" ng-model=\"$parent.smsVerificationData.phone_number\" class=\"form-control\" disabled>            \n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n        	<label for=\"inputEmail3\" class=\"control-label text-success\"> <i class=\"fa fa-check-circle\"></i> Verified </label>\n        </div>\n    </div>\n</form>\n");}]);
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
angular.module('ysSmsVerification.services', []).service('smsService', ['$q',
	'$http', '$timeout',

	function($q, $http, $timeout) {

		var smsService = {};


		var data = {
			phone_number: null,
			country_code: null,
			code: null
		}

		smsService.dataAttr = function(name, value) {
			if (value) {
				data[name] = value;
			} else {
				return data[name];
			}
		}

		// Send verification code to mobile
		// expects a phone number data.phone_number;
		smsService.send = function(num) {

			console.log(num)
			var deferred = $q.defer();

			$timeout(function() {
				deferred.resolve({
					status: "ok"
				});
			}, 1000)

			// $http.post('https://staging.yamsafer.me/sms/create', num).success(function(data, status, headers, config) {
			// 	deferred.resolve(data);
			// }).error(function(data, status, headers, config) {
			// 	deferred.reject(data);
			// });

			return deferred.promise;
		}

		// Verify code
		// expects code
		smsService.verify = function(postData) {
			// $http.post('http://staging.yamsafer.me/sms/resend'

			// $http.post('http://staging.yamsafer.me/sms/verify'

			var deferred = $q.defer();

			// $timeout(function() {
			// 	deferred.resolve({
			// 		status: "ok"
			// 	});
			// }, 1000)

			$http.post('https://staging.yamsafer.me/sms/verify', postData).success(function(data, status, headers, config) {
				
				if (status == 200) {
					deferred.resolve(data);
				}
				
				if (status.code == 400 || status.code == 500) {
					deferred.reject(data);
				}

			}).error(function(data, status, headers, config) {
				deferred.reject(data);
			});

			return deferred.promise;
		}

		return smsService;
	}
])
}());