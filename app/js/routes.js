(function (angular) {
  'use strict';

  angular.module('GHReview')
    .config(['$stateProvider', '$urlRouterProvider',
      function ($stateProvider, $urlRouterProvider) {

        function checkIfAuthenticated($state, authenticated){
          if(!authenticated.get()){
            $state.go('welcome');
          }
        }

        $urlRouterProvider.otherwise(function ($injector, $location) {
          console.warn('Url "' + $location.$$url +'" not found.');
          return '/';
        });
        // Now set up the states
        $stateProvider
          .state('index', {
            url: '/',
            templateUrl: 'templates/welcome.html',
            controller: 'RootController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated]
          })
          .state('login', {
            url: '/login',
            controller: 'LoginController'
          })
          .state('logout', {
            url: '/logout',
            controller: 'LogoutController'
          })
          .state('welcome', {
            url: '/welcome',
            templateUrl: 'templates/welcome.html',
            controller: 'WelcomeController'
          })
          .state('whoami', {
            url: '/whoami',
            templateUrl: 'templates/whoami.html',
            controller: 'WhoAmIController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated]
          })
          .state('listFilter', {
            url: '/filter/list',
            templateUrl: 'templates/filterList.html',
            controller: 'FilterListController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated]
          })
          .state('addFilter', {
            url: '/filter/add',
            templateUrl: 'templates/filter.html',
            controller: 'FilterController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated]
          })
          .state('editFilter', {
            url: '/filter/edit/{filterId}',
            templateUrl: 'templates/filter.html',
            controller: 'FilterController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated]
          })
          .state('modules', {
            url: '/filter/modules',
            templateUrl: 'templates/moduleFilter.html',
            controller: 'ModuleFilterController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated],
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
            templateUrl: 'templates/filter.html',
            controller: 'FilterController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated],
            resolve: {
              commitsApproved: 'getCommitApproved'
            }
          })
          .state('commitBySha', {
            url: '/{user}/{repo}/commit/{sha}',
            templateUrl: 'templates/commit.html',
            controller: 'CommitController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated],
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
            url: '/{user}/{repo}/blob/{sha}/{path:.*}',
            templateUrl: 'templates/file.html',
            controller: 'FileController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated],
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
}(angular));
