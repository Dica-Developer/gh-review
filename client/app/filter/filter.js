(function (angular) {
  'use strict';

  angular.module('GHReview')
    .config(function ($stateProvider) {
      $stateProvider
        .state('addFilter', {
          url: '/filter/add',
          templateUrl: 'app/filter/filter.html',
          controller: 'FilterController'
        })
        .state('editFilter', {
          url: '/filter/edit/{filterId}',
          templateUrl: 'app/filter/filter.html',
          controller: 'FilterController'
        })
        .state('commitsByFilter', {
          url: '/filter/{filterId}/commits',
          templateUrl: 'app/filter/filter.html',
          controller: 'FilterController',
          resolve: {
            commitsApproved: 'getCommitApproved'
          }
        });
    });
}(angular));

