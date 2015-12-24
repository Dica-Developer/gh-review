(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('PullRequestFilesController', ['$injector', '$scope', '$stateParams',
      function ($injector, $scope, $stateParams) {
        var ghPullRequest = $injector.get('ghPullRequest'),
          Chunk = $injector.get('Chunk'),
          _ = $injector.get('_');

        $scope.files = null;
        ghPullRequest.getFiles({
            user: $stateParams.user,
            repo: $stateParams.repo,
            number: $stateParams.number
          })
          .then(function (files) {
            var cFiles = _.map(files, function (file) {
              var lines = file.patch ? file.patch.split(/\r?\n/) : null,
              /*jshint camelcase: false*/
                start = file.blob_url.indexOf('blob/') + 'blob/'.length,
                shaAndPath = file.blob_url.substr(start),
                end = shaAndPath.indexOf('/'),
                blobSha = shaAndPath.substr(0, end);

              return {
                lines: lines ? new Chunk(lines, file.filename) : null,
                name: file.filename,
                blobSha: blobSha,
                additions: file.additions,
                deletions: file.deletions,
                changes: file.changes,
                status: file.status
              };
            });
            $scope.files = cFiles;
          });
      }
    ]);
}(angular));