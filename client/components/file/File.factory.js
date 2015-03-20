(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('File', ['$injector',
      function ($injector) {

        //var lines = file.patch ? file.patch.split(/\r?\n/) : null,
        ///*jshint camelcase: false*/
        //  start = file.blob_url.indexOf('blob/') + 'blob/'.length,
        //  shaAndPath = file.blob_url.substr(start),
        //  end = shaAndPath.indexOf('/'),
        //  blobSha = shaAndPath.substr(0, end);
        //
        //return {
        //  lines: lines ? new Chunk(lines, file.filename) : null,
        //  name: file.filename,
        //  blobSha: blobSha,
        //  additions: file.additions,
        //  deletions: file.deletions,
        //  changes: file.changes,
        //  status: file.status
        //};

        var /*$q = $injector.get('$q'),*/
          _ = $injector.get('_'),
          Chunk = $injector.get('Chunk');


        function File(options) {
          _.extend(this, options);
          if(this.patch && this.patch !== ''){
            this.lines = new Chunk(this.patch.split(/\r?\n/), this.filename);
          }
        }

        return File;
      }]);

}(angular));
