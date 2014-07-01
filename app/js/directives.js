define(['angular'], function (angular) {
    'use strict';

    /* Directives */

    var directives = angular.module('GHReview.directives', []);

    directives.directive('menu', ['authenticated', 'githubUserData', 'collectComments', function (authenticated, githubUserData, collectComments) {
        var commentCollectorInitialized = false;
        if (!commentCollectorInitialized) {
            commentCollectorInitialized = collectComments();
        }
        var returnVal = {
            restrict: 'A'
        };
        if (authenticated.get()) {
            returnVal.templateUrl = 'templates/authenticatedMenu.html';
            returnVal.link = function ($scope) {
                githubUserData.get()
                    .then(function (userData) {
                        $scope.name = userData.name;
                    });
            };
        } else {
            returnVal.templateUrl = 'templates/menu.html';
        }
        return returnVal;
    }]);

    directives.directive('formattedDate', ['humanReadableDate', function (humanReadableDate) {
        return {
            restrict: 'AE',
            template: '<span tooltip-placement="top" tooltip="{{formattedDate}}">{{fromNowDate}}</span>',
            link: function ($scope, element, attr) {
                $scope.$watch(attr.date, function (value) {
                    $scope.formattedDate = humanReadableDate.format(value);
                    $scope.fromNowDate = humanReadableDate.fromNow(value);
                });
            }
        };
    }]);

    directives.directive('commitListPaginator', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/commitListPaginator.html'
        };
    });
});
