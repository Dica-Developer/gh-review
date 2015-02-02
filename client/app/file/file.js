(function (angular) {
  'use strict';
  angular.module('GHReview')
    .config(['$stateProvider',
      function ($stateProvider) {

        $stateProvider
          .state('file', {
            url: '/{user}/{repo}/blob/{sha}/{path:.*}',
            templateUrl: 'app/file/file.html',
            controller: 'FileController',
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