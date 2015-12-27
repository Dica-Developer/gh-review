(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('PullRequestFilesController', ['$injector', '$scope', '$stateParams',
      function ($injector, $scope, $stateParams) {
        var ghPullRequest = $injector.get('ghPullRequest'),
          File = $injector.get('File'),
          _ = $injector.get('_');

        $scope.files = null;
        ghPullRequest.getFiles({
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
          })
          .then(function (files) {
            $scope.files = _.map(files, function (file) {
              return new File(file, $stateParams.user, $stateParams.repo);
            });
          });
      }
    ]);
}(angular));