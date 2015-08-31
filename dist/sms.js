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

angular.module("ysSmsVerification.templates").run(["$templateCache", function($templateCache) {$templateCache.put("mobile-number.html","<form class=\"form-horizontal\" name=\"mobileNumberForm\" >\n\n    <div class=\"form-group form-group-lg has-feedback\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">{{ \'phone_number\' | translate }}</label>\n        <div class=\"col-sm-5\">\n\n            <div ng-if=\"fail\" class=\"alert alert-danger text-center\">\n                {{ \'something_went_wrong\' | translate }}\n            </div>\n\n            <div class=\"form-group form-group-lg has-feedback\" show-errors>\n                <div class=\"col-sm-12\">\n                    <input class=\'form-control input-lg\' type=\"text\" utils-script=\"{{ utilsScript }}\" \n                    preferred-countries=\"ps, sa,jo,kw,qa,bh,uae,\"\n                     responsive-dropdown=\'true\' default-country=\"ps\" international-phone-number name=\"phoneNumber\" ng-model=\"phoneNumber\" ng-required=\"true\" />\n                    <span style=\"top:15px;right: 21px;\" ng-show=\"mobileNumberForm.phoneNumber.$valid\" class=\"fa fa-check-circle text-success form-control-feedback\" aria-hidden=\"true\"></span>\n                </div>\n            </div>\n            <div class=\"form-group form-group-lg\">\n                <div class=\"col-sm-12\">\n                    <button ng-disabled=\"submittingPhone\" type=\'buttom\' ng-click=\"submitNumber(phoneNumber)\" class=\'btn btn-primary btn-block btn-lg\'  analytics-on=\"click\" analytics-event=\"Send Me SMS button\" analytics-category=\"Checkout\">\n                        <span> {{ \'send_me_sms\' | translate }} </span>\n                        <span ng-if=\"submittingPhone\"> <i class=\"fa fa-spinner fa-spin\"></i> \n                        </span>\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n            <p class=\"help-block\">\n                <strong>{{ \'send_you_verification\' | translate }}</strong>\n                <br />{{ \'code_to_confirm\' | translate }}</p>\n        </div>\n    </div>\n</form>\n");
$templateCache.put("sms-verification.html","\n<mobile-number>\n</mobile-number>\n\n<verification-code>\n</verification-code>\n\n<verification-success>\n</verification-success>\n");
$templateCache.put("verification-code.html","<form class=\"form-horizontal\" name=\"verificationCodeForm\">\n    <div class=\"form-group form-group-lg\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">{{ \'verification_code\' | translate }}</label>\n        <div class=\"col-sm-5\">\n            <div class=\"form-group form-group-lg has-feedback\" show-errors>\n                <div class=\"col-sm-12\">\n                    <div class=\"input-group\">\n                        <input id=\"verification-code\" class=\'form-control\' type=\'text\' name=\"code\" ng-model=\'code\' ng-minlength=\"5\" ng-maxlength=\"7\" ng-required=\'true\' placeholder=\'_______ \' style=\"font-size: 30px;height: 70px;letter-spacing: 7px;font-family: monospace;text-align: center; color:black; \" />\n                        <span class=\"input-group-btn\">\n                            <a class=\"btn btn-default\" type=\"button\" style=\"padding: 14px 24px;font-size: 28px;color:black;\" disabled><i class=\"fa fa-lock\"></i>\n                            </a>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <button type=\"button\" ng-click=\"submitCode(code,$event)\"  class=\"btn btn-block book-btn-2 has-label\" ng-disabled=\"booking\">\n                        <span class=\"the-label\">\n                            <i class=\"fa fa-{{ booking ? \'spin fa-spinner\' : \'lock\' }}\"></i>\n                        </span>\n                        <span>{{ \'complete_booking\' | translate }}</span>\n                    </button>\n                    <br>\n                    <p class=\"text-center\" style=\"margin-top:10px;\">\n                        {{ \'agreement_1\' | translate }}\n                        <a target=\"_blank\" href=\"https://www.yamsafer.me/en/info/terms-of-use\"> {{ \'terms\' | translate }}</a> & <a data-placement=\"top\" data-trigger=\"click\" data-template=\"demo.html\" data-auto-close=\"1\" bs-popover ng-click=\"\">{{ \'cancelation_policy\' | translate }}</a> {{ \'agreement_2\' | translate }}\n\n                    </p>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n            <div ng-if=\"!error\">\n                <p class=\"help-block\" ng-if=\"!error\">\n                    {{ \'code_being_delivered\' | translate }}\n                    <br>{{ \'minutes_note\' | translate }}\n                    <br>\n                    <strong>\n                    <small>\n                        <timer autostart=\"false\" countdown=\"120\" max-time-unit=\"\'minute\'\" interval=\"1000\" finish-callback=\"timerFinished()\">\n                        {{mminutes}} {{ \'minute\' | translate  }} {{minutesS}}, {{sseconds}} {{ \'second\' | translate }} {{secondsS}}</timer> <i class=\"fa fa-clock-o\"></i> {{ \'passed\' | translate }}.\n                    </small>\n                </strong>\n                    <span class=\"text-center\" ng-show=\"timeout\">\n                    {{ \'did_not_receive_code\' | translate }} <br> <a ng-click=\"tryAgain()\" href=\"\"> {{ \'try_different_number\' | translate }} </a>\n                </span>\n                </p>\n            </div>\n            <div ng-if=\"error\">\n                <p class=\"help-block text-danger\">\n                    <strong>\n                         <i class=\"fa fa-warning fa-2x pull-left\"></i> {{ error.message }}\n                         <hr>\n                         {{ \'did_not_receive_code\' | translate }} <a ng-click=\"tryAgain()\" href=\"\">{{ \'try_different_number\' | translate }} </a>\n                    </strong>\n                </p>\n            </div>\n        </div>\n    </div>\n</form>\n\n\n<script type=\"text/ng-template\" id=\"demo.html\">\n    <div class=\"popover\" style=\"min-width:452px !important;\">\n        <div class=\"arrow\"></div>\n        <h3 class=\"popover-title\"> {{ \'cancellation_policy\' | translate }} </h3>\n        <div class=\"popover-content\">\n            <div class=\"panel-group\" bs-collapse data-animation=\"false\">\n                <div class=\"panel panel-default\" ng-repeat=\"room in order.rooms\">\n                    <div class=\"panel-heading\">\n                        <h4 class=\"panel-title\">\n                            <a href=\"\" bs-collapse-toggle ng-bind-html=\"room.roomName\">                            \n                            </a>\n                      </h4>\n                    </div>\n                    <div class=\"panel-collapse\" bs-collapse-target>\n                        <div class=\"panel-body\" ng-bind-html=\"room.cancellation_policy\">\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n\n        </div>\n    </div>\n\n</script>\n");}]);
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
						$scope.$emit('smsVerification:success', data);
						// set scope data
						$scope.smsVerificationData = data;
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
					$scope.utilsScript = Yamsafer.urls.utilsScriptPath;

					// Function called on submit.
					$scope.submitNumber = function(num) {

						if ($scope.mobileNumberForm.$valid) {

							// Set submitting phone flag to true obviously
							$scope.submittingPhone = true;

							// Construct number object
							var number = {};
							number.country_code = "+" + $('input[name="phoneNumber"]').intlTelInput("getSelectedCountryData").dialCode;
							number.phone_number = $scope.mobileNumberForm.phoneNumber.$viewValue.replace(number.country_code, "").replace(/\s+/g, '');

							// Submit phone number
							smsService.send(number).then(
								function submitSuccess(data) {
									if (data.status != "error") {
										smsService.dataAttr('phone_number', number.phone_number);
										smsService.dataAttr('country_code', number.country_code);
										$scope.$emit('mobileNumber:success', number);
									} else {
										// todo: handle error
									}
									$scope.submittingPhone = false;
								},
								function submitFail(data) {
									$scope.fail = true;
									$scope.$emit('mobileNumber:fail');
									// Set submitting phone flag to true obviously
									$scope.submittingPhone = false;
								});
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
		'$templateCache', '$compile', '$analytics',
		function($templateCache, $compile, $analytics) {
			return {
				restrict: 'EA',
				require: '^ysSmsVerification',
				scope: true,
				transclude: true,
				controller: function($scope, $element, $attrs, smsService) {
					// $scope.active = true;
					$scope.submitCode = function(code, $event) {

						$event.preventDefault();
						$event.stopPropagation();

						$scope.$emit('verificationCode:submitting', function(reply) {

							console.log("reply", reply);

							if (reply.success) {
								var isValidForm = $scope.verificationCodeForm.$valid;
								if (isValidForm) {

									$scope.booking = true;

									var postData = {
											'phone_number': smsService.dataAttr('phone_number'),
											'country_code': smsService.dataAttr('country_code'),
											'code': code
										},
										success = function(data) {
											if (data.status != "verification failed") {
												$scope.$emit('verificationCode:success', postData)
											} else {

												$analytics.eventTrack('SMS Verification failed ', {
													category: 'Checkout',
													label: "Server error",
													reason: data,
												});

												$scope.error = data;
												$scope.booking = false;
											}
										},
										fail = function(data) {
											$scope.error = data;
											$scope.booking = false;

													$analytics.eventTrack('SMS Verification failed (Server Error)', {
													category: 'Checkout',
													label: "Server error",
													reason: data,
												});

										}
									smsService.verify(postData).then(success, fail);
								}
							} else {
								$('#verification-code').focus();
							}
						});

					}

					$scope.timerFinished = function() {
						$scope.timeout = true;
						$scope.$emit('verificationCode:timeout', $scope);
						$scope.$apply();
					}

					$scope.tryAgain = function() {
						$scope.error = false;
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
	'$http', '$timeout', '$analytics',

	function($q, $http, $timeout,$analytics) {

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

			var deferred = $q.defer();

			var url = Yamsafer.urls.api + 'sms/create';
			if (num.country_code == '+970') {
				num.country_code = '+972';
			}

			$http.post(url, num).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(data);
			});

			return deferred.promise;
		}

		// Verify code
		// expects code
		smsService.verify = function(postData) {

			var deferred = $q.defer();

			var url = Yamsafer.urls.api + 'sms/verify';
			$http.post(url, postData).success(function(data, status, headers, config) {

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