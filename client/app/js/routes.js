(function (angular) {
  'use strict';

  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        function checkIfAuthenticated($state, authenticated){
          if(!authenticated.get()){
            $state.go('welcome');
          }
        }

        // Now set up the states
        $stateProvider
          .state('index', {
            url: '/',
            templateUrl: 'templates/welcome.html',
            controller: 'RootController',
            onEnter: ['$state', 'authenticated', checkIfAuthenticated]
          })
          .state('welcome', {
            url: '/welcome',
            templateUrl: 'templates/welcome.html',
            controller: 'WelcomeController'
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
