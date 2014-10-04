define(['angular', 'app'], function (angular, app) {
  'use strict';

  return app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
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
        .state('logout', {
          url: '/logout',
          controller: 'LogoutController'
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
        .state('editFilter', {
          url: '/filter/edit/{filterId}',
          templateUrl: 'templates/addFilter.html',
          controller: 'FilterController'
        })
        .state('modules', {
          url: '/filter/modules',
          templateUrl: 'templates/moduleFilter.html',
          controller: 'ModuleFilterController',
          resolve: {
            allRepos: ['getAllAvailableRepos',
              function (getAllAvailableRepos) {
                return getAllAvailableRepos();
              }
            ]
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
          controller: 'CommitController',
          resolve: {
            commitsAndComments: ['$q', '$stateParams', 'commentProviderService', 'commitProviderService',
              function ($q, $stateParams, commentProviderService, commitProviderService) {
                return $q.all([commitProviderService.getPreparedCommit($stateParams), commentProviderService.getCommentsForCommit($stateParams)]);
              }
            ],
            loggedInUser: ['$q', 'githubUserData',
              function ($q, githubUserData) {
                return $q.all(githubUserData.get());
              }
            ]
          }
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
            fileContent: ['$stateParams', 'getFileContent',
              function ($stateParams, getFileContent) {
                return getFileContent($stateParams);
              }
            ]
          }
        });
    }
  ]);

});
