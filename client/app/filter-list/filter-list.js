(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('listFilter', {
            url: '/filter',
            templateUrl: 'app/filter-list/filter-list.html',
            controller: 'FilterListController'
          });
      }]);
}(angular));
