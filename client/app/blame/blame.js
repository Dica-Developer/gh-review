(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('blame', {
            url: '/{user}/{repo}/blob/{sha}/{path:.*}',
            templateUrl: 'app/blame/blame.html',
            controller: 'BlameController',
            resolve: {
              fileContent: ['$stateParams', 'ghFile',
                function ($stateParams, ghFile) {
                  return ghFile.getContent($stateParams);
                }
              ]
            }
          });
      }]);
}(angular));