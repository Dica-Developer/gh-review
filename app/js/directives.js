define(function (require) {
    'use strict';

    var angular = require('angular'),
        existingCommentTemplate = require('text!../templates/existingComment.html'),
        editCommentTemplate = require('text!../templates/editComment.html'),
        previewCommentTemplate = require('text!../templates/previewComment.html'),
        commitHeaderTemplate = require('text!../templates/commitHeader.html'),
        commitHeaderCollabsibleTemplate = require('text!../templates/commitHeaderCollabsible.html');

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

    directives.directive('avatar', function () {
        return {
            restrict: 'E',
            template: '<a href="{{link}}" title="{{name}}" target="_blank"><img height="32px" class="media-object pull-left" ng-src="{{imgLink}}"></a>',
            link: function ($scope, element, attr) {
                $scope.imgLink = 'images/icon-social-github-128.png';
                $scope.$watch(attr.commit, function (value) {
                    $scope.name = value.name;
                    $scope.imgLink = value.avatar;
                    $scope.link = value.committerLink || '#';
                });
            }
        };
    });

    directives.directive('comment', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                $scope.$watch(attr.mode, function (mode) {
                    if(mode === 'edit'){
                        $compile(element.html(editCommentTemplate).contents())($scope);
                    } else if (mode === 'preview'){
                        $compile(element.html(previewCommentTemplate).contents())($scope);
                    } else {
                        $compile(element.html(existingCommentTemplate).contents())($scope);
                    }
                });
            }
        };
    }]);


    var maxLengthForFirstLine = 100;
    directives.directive('commitMessageTeaser', function () {
        return {
            restrict: 'E',
            link: function ($scope, element, attr) {
                $scope.$watch(attr.message, function (value) {
                    var splittedValue = value.split('\n');
                    var firstLine = splittedValue[0];
                    if(firstLine.length >= maxLengthForFirstLine){
                        firstLine = firstLine.substr(0, maxLengthForFirstLine);
                        firstLine = firstLine + '...';
                    }
                    element.text(firstLine);
                });
            }
        };
    });

    directives.directive('commitHeader', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            link: function ($scope, element, attr) {
                $scope.$watch(attr.commit, function (value) {
                    var message = value.message;
                    var splittedMessage = message.split('\n');
                    var firstLine = splittedMessage[0];
                    var shouldBeCollabsible = splittedMessage.length > 1 || firstLine.length >= maxLengthForFirstLine;
                    if(shouldBeCollabsible){
                        $compile(element.html(commitHeaderCollabsibleTemplate).contents())($scope);
                    } else {
                        $compile(element.html(commitHeaderTemplate).contents())($scope);
                    }
                });
            }
        };
    }]);
});
