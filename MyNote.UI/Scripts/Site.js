//Angular JS version
var apiUrl = 'https://localhost:44339/';
var app = angular.module("myApp", ["ngRoute"]);
app.directive("messages", function () {
    return {
        templateUrl: "directives/messages.html"
    };
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "pages/app.html", controller: "appController"
        })
        .when("/login", {
            templateUrl: "pages/login.html", controller: "loginController"
        })

});

app.controller("mainController", function ($scope, $http) {
    $scope.isLoading = false;
    $scope.showLoading = function () {
        $scope.isLoading = true;
    };
    $scope.hideLoading = function () {
        $scope.isLoading = false;
    };
    $scope.loginData = function () {

        var loginDataJson = localStorage["login"] | sessionStorage["login"];
        if (!loginDataJson) {
            return null
        }
        try {
            return JSON.parse(loginDataJson);
        } catch (e) {
            return null;
        }

    };
    $scope.token = function () {
        var loginData = $scope.loginData();
        if (!loginData) {
            return null;
        }
        return loginData.access_token;
    }
    $scope.ajax = function (apiUri, method, data, isAuth, successFunc, errorFunc) {
        $scope.showLoading();
        var headers = null;
        if (isAuth)
            headers = { Authorization: "Bearer " + $scope.token() };

        $http({
            url: apiUrl + apiUri,
            method: method,
            headers: headers,
            data: data
        }).then(
            function (response) {
                successFunc(response)
                $scope.hideLoading();
            },
            function (response) {
                errorFunc(response)
                $scope.hideLoading();
            }
        );
    };

    $scope.checkAuth = function () {
        var tokenJson = localStorage["login"] | sessionStorage["login"];
        if (!tokenJson) {
            return;
        }
        //token is Valid
    };
    $scope.checkAuth();

});

app.controller("loginController", function ($scope, $http) {
    $scope.currentTab = "login"
    $scope.messageFor = "login";
    $scope.messageType = "info";
    $scope.messages = [];
    $scope.error = function (data) {
        $scope.messageFor = $scope.currentTab;
        $scope.messageType = "danger";
        $scope.messages = [];
        if (data.ModelState) {
            for (var prop in data.ModelState) {
                for (var index in data.ModelState[prop]) {
                    $scope.messages.push(data.ModelState[prop][index])
                }

            }
        }
    };
    $scope.success = function (data) {
        $scope.messageFor = $scope.currentTab;
        $scope.messageType = "success";
        $scope.messages = [data];
    };
    $scope.resetRegisterForm = function () {
        $scope.registerForm.Email = "";
        $scope.registerForm.Password = "";
        $scope.registerForm.ConfirmPassword = "";
    };
    $scope.resetLoginForm = function () {
        $scope.registerForm.Email = "";
        $scope.registerForm.Password = "";
        $scope.registerForm.ConfirmPassword = "";
    };
    $scope.registerForm = {
        Email: "",
        Password: "",
        ConfirmPassword: ""
    };
    $scope.loginForm = {
        grant_type: "password",
        username: "",
        password: ""
    };
    $scope.rememberMe = false;
    $scope.$watch('currentTab', function () {
        $scope.resetLoginForm();
        $scope.resetRegisterForm();
        $scope.messages = [];
    })

    $scope.registerSubmit = function () {
        $scope.ajax("api/Account/Register", "post", $scope.registerForm, false,
            function (response) {
                $scope.resetRegisterForm();
                $scope.success("Your account has been successfully created.")
            },
            function (response) {
                $scope.error(response.data)
            }
        );
    };
    $scope.loginSubmit = function () {

    };
});

app.controller("appController", function ($scope, $location) {
    $location.path("/login");
});

$(function () {

    $('.navbar-login a').click(function (e) {
        e.preventDefault();
        var href = $(this).attr("href");
        $('#pills-tab a[href="' + href + '"]').tab('show')
    })
    $('body').on('click', '#pills-tab a', function (e) {
        e.preventDefault()
        $(this).tab('show')
    });
    // https://stackoverflow.com/questions/37769900/how-to-change-a-scope-variable-outside-the-controller-in-angularjs
    // https://www.hiren.dev/2014/06/how-to-access-scope-variable-outside.html
    $('body').on('shown.bs.tab', 'a[data-toggle="pill"]', function (e) {
        var $scope = angular.element($('[ng-view]')[0]).scope();
        $scope.currentTab = $(e.target).attr("id") == "pills-signup-tab" ? "register" : "login"
        $scope.$apply();
    });

})
