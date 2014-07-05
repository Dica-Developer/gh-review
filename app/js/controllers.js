define(['angular', 'lodash'], function (angular, _) {
    'use strict';

    /* Controllers */

    return angular.module('GHReview.controllers', [])
        // Sample controller where service is being used
        .controller('RootController', [
            '$scope',
            '$location',
            '$http',
            '$window',
            'authenticated',
            'githubOptions',
            function ($scope, $location, $http, $window, authenticated, githubOptions) {
                var absUrl = $location.absUrl();
                var codeIndex = absUrl.indexOf('code');
                var equalIndex = absUrl.indexOf('=');
                var hashIndex = absUrl.indexOf('#');
                if (codeIndex > -1) {
                    var authCode = absUrl.slice(equalIndex + 1, hashIndex);
                    var url = githubOptions.accessTokenUrl + '?' +
                        'client_id='+ githubOptions.clientId +'&' +
                        'code=' + authCode + '&' +
                        'scope=' + githubOptions.apiScope;
                    $http.post(url)
                        .then(function (resp) {
                            if (!resp.data.error) {
                                authenticated.set(resp.data);
                            }
                            $window.location.href = $window.location.origin;
                        });
                }
            }
        ])

        .controller('LoginController', ['$scope', '$window', 'githubOptions', function ($scope, $window, githubOptions) {
            var url = 'https://github.com/login/oauth/authorize?' +
                'client_id='+ githubOptions.clientId +'&' +
                'redirect_uri='+ githubOptions.redirectUri +'&' +
                'scope=' + githubOptions.apiScope;

            $window.location.href = url;
        }])

        .controller('WhoAmIController', ['$scope', 'githubUserData', function ($scope, githubUserData) {
            githubUserData.get()
                .then(function (userData) {
                    $scope.userData = userData;
                });
        }])

        .controller('FilterListController', ['$scope', 'filter', function ($scope, filter) {
            var groupedFilter = _.groupBy(filter.getAll(), function (filter) {
                return filter.getRepo();
            });

            var sortedGroupedFilter = _.sortBy(groupedFilter, 'length');
            $scope.filterList = sortedGroupedFilter.reverse();
            $scope.removeFilter = function (filterId, event) {
                if (void 0 !== event) {
                    event.preventDefault();
                }
                filter.remove(filterId);
                $scope.filterList = filter.getAll();
            };
        }]);
});