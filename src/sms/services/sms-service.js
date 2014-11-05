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
