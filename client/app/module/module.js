(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('modules', {
            url: '/filter/modules',
            templateUrl: 'app/module/module.html',
            controller: 'ModuleFilterController'
          });
      }]);
}(angular));