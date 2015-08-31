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