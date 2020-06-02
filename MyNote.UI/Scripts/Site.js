//Angular JS version
var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "pages/app.html"
        })
        .when("/login", {
            templateUrl: "pages/login.html"
        })
      
});

app.controller("myCtrl", function ($scope) {
    $scope.test = "hello world";
    $scope.checkAuth = function () {
        var tokenJson = localStorage["token"] | sessionStorage["token"];
        if (!tokenJson) {
            return;
        }
        //token is Valid
    };
      $scope.checkAuth();
  
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
})
