/*global Blob*/
(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('importExport', ['$q', '$log', function ($q, $log) {
      var isFileSaverSupported = false;
      try {
        /*jshint -W058*/
        isFileSaverSupported = !!new Blob;
      } catch (e) {
      }

      function saveAs(blob, fileName) {
        window.saveAs(blob, fileName);
      }

      function saveJson(content, fileName) {
        var blob = new Blob([content], {type: 'application/json;charset=utf-8'});
        saveAs(blob, fileName);
      }

      this.exportFilter = function (exportName, allFilter) {
        var filterString = JSON.stringify(allFilter);
        saveJson(filterString, exportName);
      };

      function readFile(file) {
        var defer = $q.defer();
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (event) {
          defer.resolve(event.target.result);
        };
        return defer.promise;
      }

      function parseFileContent(fileContent) {
        var defer = $q.defer(),
          parsedFileContent = false;
        try {
          parsedFileContent = JSON.parse(fileContent);
        } catch (error) {
          defer.reject(error);
          $log.error(error);
        }
        if(parsedFileContent){
          defer.resolve(parsedFileContent);
        }
        return defer.promise;
      }

      this.importFilter = function (file) {
        return readFile(file).then(parseFileContent);
      };

    }]);

}(angular));
