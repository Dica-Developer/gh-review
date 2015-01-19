(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('humanReadableDate', ['moment', function (moment) {
      return {
        fromNow: function (date) {
          var retVal = null;
          if (date) {
            retVal = moment(date).fromNow();
          }
          return retVal;
        },
        format: function (date) {
          var retVal = null;
          if (date) {
            retVal = moment(date).format('llll');
          }
          return retVal;
        },
        customFormat: function (date, formatPattern) {
          var retVal = null;
          if (date) {
            retVal = moment(date).format(formatPattern);
          }
          return retVal;
        }
      };
    }]);

}(angular));
