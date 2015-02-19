(function (angular) {
  'use strict';

  angular.module('contributorCollectorMock', [])
    .factory('contributorCollector', ['$q', function ($q) {

      return {
        get: function(){
          return $q.when();
        }
      };
    }]);
}(angular));