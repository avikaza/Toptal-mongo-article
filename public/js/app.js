'use strict';

// Declare app level module which depends on filters, and services


var mockData = [];

var app = angular.module('myApp', []);

function dataAPI($scope, $http) {

    $scope.records = [];

    $scope.loadData = function() {
        var httpRequest = $http({
            method: 'GET',
            url: 'http://52.10.36.38:3000/collections/faculty',
            data: mockData

        }).success(function(data, status) {
            $scope.records = data;
        });

    };

};


