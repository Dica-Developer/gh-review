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
              fileContent: ['$stateParams', 'getFileContent',
                function ($stateParams, getFileContent) {
                  return getFileContent($stateParams);
                }
              ]
            }
          });
      }]);
}(angular));