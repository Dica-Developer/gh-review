(function (angular) {
  'use strict';

  angular.module('GHReview')
    .config(function ($stateProvider) {
      $stateProvider
        .state('addFilter', {
          url: '/filter/add',
          templateUrl: 'app/filter/filter.html',
          controller: 'FilterController',
          resolve: {
            repoList: ['repoCollector', function(repoCollector){
              return repoCollector.getAll();
            }]
          }
        })
        .state('commitsByFilter', {
          url: '/filter/{filterId}/commits',
          templateUrl: 'app/filter/filter.html',
          controller: 'FilterController',
          resolve: {
            repoList: ['repoCollector', function(repoCollector){
              return repoCollector.getAll();
            }]
          }
        });
    });
}(angular));

