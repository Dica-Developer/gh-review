(function (angular) {
  'use strict';

  angular.module('treeCollectorMock', [])
    .factory('treeCollector', ['$q', function ($q) {

      return {
        get: function(){
          return $q.when();
        }
      };
    }]);
}(angular));