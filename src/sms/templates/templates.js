angular.module("ysSmsVerification.templates").run(["$templateCache", function($templateCache) {$templateCache.put("mobile-number.html","<form class=\"form-horizontal\" name=\"mobileNumberForm\" >\n\n    <div class=\"form-group form-group-lg has-feedback\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">Phone Number</label>\n        <div class=\"col-sm-5\">\n\n            <div ng-if=\"fail\" class=\"alert alert-danger text-center\">\n                Something went wrong, make sure you entered a valid phone number, or try a different one\n            </div>\n\n            <div class=\"form-group form-group-lg has-feedback\">\n                <div class=\"col-sm-12\">\n                    <input class=\'form-control input-lg\' type=\"text\" utils-script=\"{{ utilsScript }}\" preferred-countries=\"ps, sa,jo,kw\" responsive-dropdown=\'true\' default-country=\"ps\" international-phone-number name=\"phoneNumber\" ng-model=\"phoneNumber\" ng-required=\"true\" />\n                    <span style=\"top:15px;right: 21px;\" ng-show=\"mobileNumberForm.phoneNumber.$valid\" class=\"fa fa-check-circle text-success form-control-feedback\" aria-hidden=\"true\"></span>\n                </div>\n            </div>\n            <div class=\"form-group form-group-lg\">\n                <div class=\"col-sm-12\">\n                    <button ng-disabled=\"submittingPhone\" type=\'buttom\' ng-click=\"submitNumber(phoneNumber)\" class=\'btn btn-primary btn-block btn-lg\'>\n                        <span> Send Me SMS </span>\n                        <span ng-if=\"submittingPhone\"> <i class=\"fa fa-spinner fa-spin\"></i> \n                        </span>\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n            <p class=\"help-block\">\n                <strong>We will send you a verification code by SMS.</strong>\n                <br />You will need this code to confirm your booking.</p>\n        </div>\n    </div>\n</form>\n");
$templateCache.put("sms-verification.html","\n<mobile-number>\n</mobile-number>\n\n<verification-code>\n</verification-code>\n\n\n<verification-success>\n</verification-success>\n");
$templateCache.put("verification-code.html","<form class=\"form-horizontal\" name=\"verificationCodeForm\" >\n    <div class=\"form-group form-group-lg\">\n        <label for=\"inputEmail3\" class=\"col-sm-3 control-label\">Verfication Code</label>\n        <div class=\"col-sm-5\">\n            <div class=\"form-group form-group-lg has-feedback\" show-errors>\n                <div class=\"col-sm-12\">\n                    <div class=\"input-group\">\n                        <input id=\"verification-code\" class=\'form-control\' type=\'text\' name=\"code\" ng-model=\'code\' ng-minlength=\"5\" ng-maxlength=\"7\" ng-required=\'true\' placeholder=\'_______ \' style=\"font-size: 30px;height: 70px;letter-spacing: 7px;font-family: monospace;text-align: center; color:black; \" />\n                        <span class=\"input-group-btn\">\n                            <a class=\"btn btn-default\" type=\"button\" style=\"padding: 14px 24px;font-size: 28px;color:black;\" disabled><i class=\"fa fa-lock\"></i>\n                            </a>\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <button type=\"button\" ng-click=\'submitCode(code)\' class=\"btn btn-block book-btn-2 has-label\" ng-disabled=\"booking\">\n                        <span class=\"the-label\">\n                            <i class=\"fa fa-{{ booking ? \'spin fa-spinner\' : \'lock\' }}\"></i>\n                        </span>\n                        <span>Complete Booking</span>\n                    </button>\n                </div>\n            </div>\n        </div>\n        <div class=\"col-sm-4\">\n        \n            <div ng-if=\"!error\">\n                <p class=\"help-block\" ng-if=\"!error\">\n                    Your code is being delivered by SMS.\n                    <br>This may take up to 2:30 minutes depending on your network operator.\n                    <br>\n                    <strong>\n                    <small>\n                        <timer autostart=\"false\" countdown=\"5\" max-time-unit=\"\'minute\'\" interval=\"1000\" finish-callback=\"timerFinished()\">{{mminutes}} minute{{minutesS}}, {{sseconds}} second{{secondsS}}</timer> <i class=\"fa fa-clock-o\"></i> passed.\n                    </small>\n                </strong>\n                    <span class=\"text-center\" ng-show=\"timeout\">\n                    Didn\'t receive code? <br> <a ng-click=\"tryAgain()\" href=\"\">Try a different number</a>\n                </span>\n                </p>\n            </div>\n\n            <div ng-if=\"error\">\n                <p class=\"help-block text-danger\">\n                    <strong>\n                         <i class=\"fa fa-warning fa-2x pull-left\"></i> {{ error.message }}\n                         <hr>\n                         Didn\'t receive code ? <a ng-click=\"tryAgain()\" href=\"\">Try a different number</a>\n                    </strong>\n                </p>\n            </div>\n\n        </div>\n    </div>\n</form>\n");}]);