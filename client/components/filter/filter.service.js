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

      this.remove = function (filterId) {
        var filter = this.getById(filterId);
        filter.events.remove();
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