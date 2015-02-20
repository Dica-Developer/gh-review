(function (angular) {
  'use strict';


  angular.module('GHReview').service('filter', ['$log', '_', 'localStorageService', 'Filter',
    function ($log, _, localStorageService, Filter) {

      var filterCache = {},
        fastClone = function(objectToClone){
          return JSON.parse(JSON.stringify(objectToClone));
        };

      this.getAll = function () {
        var self = this,
          filter = [],
          filterIds = localStorageService.get('filter');
        if (filterIds !== null) {
          filterIds.split(',').forEach(function (id) {
            filter.push(self.getById(id));
          });
        }
        return filter;
      };

      this.getById = function (filterId) {
        if (!filterCache[filterId]) {
          filterCache[filterId] = new Filter(filterId);
        }
        return filterCache[filterId];
      };

      this.getNew = function(){
        var newFilter = new Filter();
        filterCache[newFilter.getId()] = newFilter;
        return newFilter;
      };

      this.getNewFromSettings = function(settings){
        if(settings.meta.id){
          delete settings.meta.id;
        }
        var newFilter = this.getNew(),
          tmpIdStore = newFilter.getId();

        newFilter.options = fastClone(settings);
        newFilter.options.meta.id = tmpIdStore;
        return newFilter;
      };

      this.getCloneOf = function(filter){
        if (filter instanceof Filter) {
          var clonedFilter = new Filter();
          clonedFilter.options = fastClone(filter.options);
          clonedFilter.options.meta.originalId = filter.options.meta.id;
          clonedFilter.options.meta.id = clonedFilter.options.meta.id + '_clone';
          clonedFilter.options.meta.isClone = true;
          return clonedFilter;
        } else {
          $log.error('No Filter');
        }
      };

      this.remove = function (filterId) {
        localStorageService.remove('filter-' + filterId);
        var filterList = localStorageService.get('filter').split(',');
        _.remove(filterList, function (value) {
          return value === filterId;
        });
        localStorageService.set('filter', filterList.join(','));
      };
    }
  ]);
}(angular));