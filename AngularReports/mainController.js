(function () {

    var app = angular.module("myApp");

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

        //global var
        var bearerToken = "";

        //username and password config. also need grant_type
        var config = {};
        config.username = "adam@gs.ca";
        config.password = "P@$$w0rd";
        config.grant_type = "password";

        //get token request data
        var tokenRequest = {
            method: 'POST',
            url: 'http://localhost:11238/Token',
            data: config,
        }

        //save the bearer token
        var setToken = function (response) {
            console.log("inside success response");
            alert(JSON.stringify(response));
            $scope.bearer = response.access_token;
            bearerToken = response.access_token;

            //since all steps are automated,now make the API call for the filter
            callAPI();
        }

        //make the API call for the Token
        console.log("about to call");
        $http(tokenRequest).success(setToken);

        
        // ------- API REQUEST -----------

        function callAPI() {

            var report = function (response) {
                console.log("inside success response 2");
                alert(JSON.stringify(response));

                $scope.content = JSON.stringify(response);
            }



            var filterData = {};
            filterData.year = "1";
            filterData.month = "4";

            var reportGenRequest = {
                method: 'POST',
                url: 'http://localhost:11238/api/Reports',
                headers: {
                    "Authorization": "Bearer " + bearerToken
                },
                data: filterData,
            }

            $http(reportGenRequest).success(report);
        }
        



        
        var onFailure = function(response){
            console.log("inside failure response");
            alert(JSON.stringify(response));
        }


    }

    app.controller("MainController", ["$scope", "$http", MainController]);


}())