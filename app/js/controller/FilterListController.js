define(function (require) {
  'use strict';

  var controllers = require('controllers'),
    _ = require('lodash');

  controllers
    .controller('FilterListController', ['$scope', '$state', 'filter', 'events',
      function ($scope, $state, filter, events) {
        $scope.groupingOptions = [{
          value: 'repo',
          label: 'Repository'
        }, {
          value: 'state',
          label: 'Review State'
        }, {
          value: 'owner',
          label: 'Owner'
        }];
        $scope.selectedGrouping = $scope.groupingOptions[0];
        var getGroupedAndSortedFilter = function () {
          var groupedFilter = _.groupBy(filter.getAll(), function (filter) {
            var groupValue;
            switch ($scope.selectedGrouping.value) {
            case 'repo':
              groupValue = filter.getRepo();
              break;
            case 'state':
              groupValue = filter.getState();
            break;
            case 'owner':
              groupValue = filter.getOwner();
              break;
            default:
              console.error('Value for filter group unknown: ' + $scope.selectedGrouping.value);
              groupValue = filter.getRepo();
              break;
            }
            return groupValue;
          });

          var sortedGroupedFilter = _.sortBy(groupedFilter, 'length');
          return sortedGroupedFilter.reverse();
        };

        var updateFilterList = function () {
          $scope.filterList = getGroupedAndSortedFilter();
          $scope.filterEvents = events.getAll();
        };

        $scope.removeFilter = function (filterId, event) {
          if (void 0 !== event) {
            event.preventDefault();
          }
          filter.remove(filterId);
          updateFilterList();
        };
        $scope.editFilter = function (filterId, event) {
          if (void 0 !== event) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          $state.go('editFilter', {
            'filterId': filterId
          });
        };
        $scope.$watch('selectedGrouping', updateFilterList);
        updateFilterList();
      }
    ]);
});
