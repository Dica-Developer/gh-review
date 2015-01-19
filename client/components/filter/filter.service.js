(function (angular) {
  'use strict';


  angular.module('GHReview').factory('filter', ['_', 'localStorageService', 'filterProvider',
    function (_, localStorageService, filterProvider) {

      var getAll = function () {
        var filter = [];
        var filterIds = localStorageService.get('filter');
        if (filterIds !== null) {
          filterIds.split(',').forEach(function (id) {
            filter.push(filterProvider.get(id));
          });
        }
        return filter;
      };

      var getById = function (filterId) {
        return filterProvider.get(filterId);
      };

      var remove = function (filterId) {
        localStorageService.remove('filter-' + filterId);
        var filterList = localStorageService.get('filter').split(',');
        _.remove(filterList, function (value) {
          return value === filterId;
        });
        localStorageService.set('filter', filterList.join(','));
      };

      return {
        getAll: getAll,
        getById: getById,
        remove: remove
      };

    }
  ]);

}(angular));