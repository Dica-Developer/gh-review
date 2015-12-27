(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('File', ['$injector',
      function ($injector) {

        var Chunk = $injector.get('Chunk'),
          _ = $injector.get('_'),
          ghFile = $injector.get('ghFile');

        function getBlobSha(file) {
          var start = file.blob_url.indexOf('blob/') + 'blob/'.length,
            shaAndPath = file.blob_url.substr(start),
            end = shaAndPath.indexOf('/');

          return shaAndPath.substr(0, end);
        }

        function processPatch(file) {
          var patch = file.patch ? file.patch : file,
            lines = patch ? patch.split(/\r?\n/) : null;

          return lines ? new Chunk(lines, file.filename) : null;
        }

        function File(file, user, repo) {
          _.extend(this, file);

          this.user = user;
          this.repo = repo;
          this.blobSha = getBlobSha(file);
          this.blob = processPatch(file);

          ghFile.getContent({
              user: this.user,
              repo: this.repo,
              path: this.filename,
              ref: this.blobSha
            })
            .then(function (content) {
              this.blob.processFullBlob(content);
            }.bind(this));
        }

        return File;
      }]);

}(angular));
