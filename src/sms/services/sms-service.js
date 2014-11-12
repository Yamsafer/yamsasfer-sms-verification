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

			// $timeout(function() {
			// 	deferred.resolve({
			// 		status: "ok"
			// 	});
			// }, 1000)

			$http.post('https://staging.yamsafer.me/sms/create', num).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(data);
			});

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