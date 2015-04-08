(function () {

    var app = angular.module("myApp", []);

    // -- APP CONFIG -- CONVERTS JSON TO FORMDATA -- 
    app.config(['$httpProvider', function ($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                    else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }]);
    // Execute bootstrapping code and any dependencies.
    app.run(['$q', '$rootScope',
        function ($q, $rootScope) {
        }]);

//-----------------------------------------------------------------------------------------------------

    // -- MAINCONTROLLER --
    var MainController = function ($scope, $http) {

        console.log("Initializing Main Controller");
        $scope.loginForm = true;
        $scope.reportForm = false;
        $scope.reportResult = false;
        //global var
        var bearerToken = "";


        $scope.login = function () {
            var config = {};
            config.username = $scope.username;
            config.password = $scope.password;
            config.grant_type = "password";
            
            var tokenRequest = {
                method: 'POST',
                url: 'http://a3.thunderchicken.ca/Token',
                data: config,
            }
          /*  var onFailure = function (response) {
                console.log("inside failure response");
               
            }*/

            var saveToken = function(response)
            {
                $scope.loginForm = false;
                $scope.reportForm = true;
                $scope.reportResult = false;
                bearerToken = response.access_token;
                console.log("our new test" + bearerToken);
            }            
           
            $http(tokenRequest).success(saveToken);
        }

        $scope.genReport=function()
        {
            console.log("test year & month " + $scope.year + "   " + $scope.month)
            var filterData = {};
            filterData.year = $scope.year;
            filterData.month = $scope.month;

            var repGenRequest = {
                method: 'POST',
                url: 'http://a3.thunderchicken.ca/api/Reports',
                headers: {
                    "Authorization": "Bearer " + bearerToken
                },
                data: filterData,
            }

            var returnreport = function(response)
            {
                $scope.loginForm = false;
                $scope.reportForm = true;
                $scope.reportResult = true;
               // alert("in response area")
                $scope.content = response;
            }

            $http(repGenRequest).success(returnreport);
             

        }

       
    }
    
    app.controller("MainController", ["$scope", "$http", MainController]);


}())