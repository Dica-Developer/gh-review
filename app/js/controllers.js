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

        .controller('FilterListController', ['$scope', '$state', 'filter', function ($scope, $state, filter) {
            $scope.groupingOptions = [
                {
                    value: 'repo',
                    label: 'Repository'
                },
                {
                    value: 'state',
                    label: 'Review State'
                }
            ];
            $scope.selectedGrouping = $scope.groupingOptions[0];
            var getGroupedAndSortedFilter = function(){
                var groupedFilter = _.groupBy(filter.getAll(), function (filter) {
                    var groupValue;
                    switch($scope.selectedGrouping.value){
                    case 'repo':
                        groupValue = filter.getRepo();
                        break;
                    case 'state':
                        groupValue = filter.getState();
                        break;
                    default:
                        console.error('Value for filter group unknown: ' + $scope.selectedGrouping.value);
                        groupValue = filter.getRepo();
                        break;
                    }
                    return groupValue;
                });

                var sortedGroupedFilter = _.sortBy(groupedFilter, 'length');
                return sortedGroupedFilter.reverse();
            };

            var updateFilterList = function(){
                $scope.filterList = getGroupedAndSortedFilter();

            };
            $scope.removeFilter = function (filterId, event) {
                if (void 0 !== event) {
                    event.preventDefault();
                }
                filter.remove(filterId);
                updateFilterList();
            };
            $scope.editFilter = function (filterId, event) {
                if (void 0 !== event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
                $state.go('editFilter', {'filterId': filterId});
            };
            $scope.$watch('selectedGrouping', updateFilterList);
            updateFilterList();
        }]);
});