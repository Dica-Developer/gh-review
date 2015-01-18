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
          });
      }
    ]);
}(angular));
