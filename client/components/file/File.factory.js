(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('File', ['$injector',
      function ($injector) {

        var _ = $injector.get('_'),
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
