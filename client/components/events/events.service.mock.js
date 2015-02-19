(function(angular){
  'use strict';
  angular.module('eventsMock', [])
    .factory('events', function() {
      return {
          getAll: function() {}
      };
    });
}(angular));
