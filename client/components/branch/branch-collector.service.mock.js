(function (angular) {
  'use strict';

  angular.module('branchCollectorMock', [])
    .factory('branchCollector', ['$q', function ($q) {

      return {
        get: function(){
          return $q.when();
        }
      };
    }]);
}(angular));