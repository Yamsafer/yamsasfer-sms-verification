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

angular.module("ysSmsVerification.templates").run(["$templateCache", function($templateCache) {$templateCache.put("mobile-number.html","<form name=\"mobileNumberForm\" ng-submit=\'submitNumber(phoneNumber)\' >\n	<div ng-if=\"fail\" class=\"alert alert-danger text-center\">\n		Something went wrong, make sure you entered a valid phone number, or try a different one\n	</div>\n	<div class=\'form-group\'>\n		<input class=\'form-control input-lg\'\n			type=\"tel\"\n			preferred-countries=\"ps, sa,jo,kw\"\n			responsive-dropdown=\'true\'\n			default-country=\"ps\"\n			international-phone-number\n			name=\"phoneNumber\"\n			ng-model=\"phoneNumber\"\n			ng-required=\"true\" />\n	</div>\n	<div class=\'form-group\'>\n		<button type=\'submit\'  class=\'btn btn-primary btn-block btn-lg\'>Submit</button>\n	</div>\n</form>\n");
$templateCache.put("sms-verification.html","\n<div class=\"alert alert-info text-center\"  ng-show=\"phoneNumber\">\n<strong>Mobile Number</strong> : {{ phoneNumber }}\n</div>\n\n<mobile-number>\n</mobile-number>\n\n<verification-code>\n</verification-code>\n");
$templateCache.put("verification-code.html","<form name=\"verificationCodeForm\" ng-submit=\'submitCode(code)\' >\n	<div class=\'form-group has-feedback\'>\n		<input class=\'form-control input-lg\' type=\'text\' name=\"code\" ng-model=\'code\' ng-minlength=\"5\" ng-maxlength=\"7\" ng-required=\'true\' placeholder=\'Verification Code \' style=\" font-size: 30px;height: 70px;letter-spacing: 7px;font-weight: bold;font-family: monospace;text-align: center; \" />\n		<span class=\"glyphicon glyphicon-lock form-control-feedback text-danger\" style=\"width: 50px;height: 50px;line-height: 25px;font-size: 27px;right: 10px;\" /></span>\n	</div>\n	<p class=\"text-center\">\n		You should receive verification code within : <timer autostart=\"false\" countdown=\"5\" max-time-unit=\"\'minute\'\" interval=\"1000\" finish-callback=\"timerFinished()\">{{mminutes}} minute{{minutesS}}, {{sseconds}} second{{secondsS}}</timer>\n	</p>\n	<p class=\"text-center\" ng-show=\"timeout\">\n		Didn\'t receive code ? <a ng-click=\"tryAgain()\" href=\"\">Try a different number</a>\n	</p>\n	<div class=\'form-group\'>\n		<button type=\'submit\' class=\'btn btn-primary btn-block btn-lg\'>Submit</button>\n	</div>\n</form>\n");}]);
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

angular.module('ysSmsVerification.services', []).service('smsService', ['$q',
	'$http',

	function ($q, $http) {

		var smsService = {};

		// Send verification code to mobile
		// expects a phone number data.phone_number;
		smsService.send = function (number) {

			var deferred = $q.defer();


			// Just for testing
			deferred.resolve({status : 'ok'});
			return deferred.promise;
			// ---------------------------------

			$http.post('http://192.168.3.106:3000/api/subscriptions/create', {
				country_code: "+972",
				phone_number: "599941492"
			}).success(function (data, status, headers, config) {
				deferred.resolve(data);
			}).error(function (data, status, headers, config) {
				deferred.reject(data);
			});

			return deferred.promise;
		}

		// Verify code
		// expects code
		smsService.verify = function (code) {

			var deferred = $q.defer();
			$http.post('/someUrl', code).success(function (data,
				status, headers, config) {
				deferred.resolve(data);
			}).error(function (data, status, headers, config) {
				deferred.reject(data);
			});

			return deferred.promise;
		}

		return smsService;
	}
])

}());