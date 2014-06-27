define(['angular', 'app'], function (angular, app) {
    'use strict';

    return app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        //
        // Now set up the states
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/welcome.html',
                controller: 'RootController'
            })
            .state('login', {
                url: '/login',
                controller: 'LoginController'
            })
            .state('whoami', {
                url: '/whoami',
                templateUrl: 'templates/whoami.html',
                controller: 'WhoAmIController'
            })
            .state('filter', {
                url: '/filter',
                templateUrl: 'templates/filterList.html',
                controller: 'FilterListController'
            })
            .state('addFilter', {
                url: '/filter/add',
                templateUrl: 'templates/addFilter.html',
                controller: 'FilterController'
            })
            .state('filter/modules', {
                url: '/filter/modules',
                templateUrl: 'templates/moduleFilter.html',
                controller: 'ModuleFilterController',
                resolve: {
                    allRepos: function ($q, getAllAvailableRepos) {
                        return getAllAvailableRepos();
                    }
                }
            })
            .state('commitsByFilter', {
                url: '/filter/{filterId}/commits',
                templateUrl: 'templates/commitList.html',
                controller: 'CommitListController',
                resolve: {
                    commitsApproved: 'getCommitApproved'
                }
            })
            .state('commitBySha', {
                url: '/{user}/{repo}/commit/{sha}',
                templateUrl: 'templates/commit.html',
                controller: 'CommitController'
            })
            .state('filterModuleFile', {
                url: '/{user}/{repo}/blob/{sha}/*path?ref',
                templateUrl: 'templates/file.html',
                controller: 'FileController',
                resolve: {
                    /**
                     *
                     * @param $stateParams
                     * @param $stateParams.user
                     * @param $stateParams.repo
                     * @param $stateParams.name
                     * @returns {$q}
                     */
                    fileContent: function ($stateParams, getFileContent) {
                        return getFileContent($stateParams);
                    }
                }
            });
    }]);

});