(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('FilterListController', ['$scope', '$state', '$log', '_', 'filter', 'events', 'userPref',
      function ($scope, $state, $log, _, filter, events, userPref) {
        if (filter.getAll().length === 0) {
          $state.go('addFilter');
        }
        $scope.groupingOptions = [
          {
            value: 'repo',
            label: 'Repository'
          },
          {
            value: 'state',
            label: 'Review State'
          },
          {
            value: 'owner',
            label: 'Owner'
          }
        ];

        var filterListSettings = userPref.getFilterList(),
          groupingOptionIndex = 0;

        if (filterListSettings && filterListSettings.grouping) {
          groupingOptionIndex = _.findIndex($scope.groupingOptions, {'value': filterListSettings.grouping});
        }

        $scope.selectedGrouping = $scope.groupingOptions[groupingOptionIndex];

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
              $log.error('Value for filter group unknown: ' + $scope.selectedGrouping.value);
              groupValue = filter.getRepo();
              break;
            }
            return groupValue;
          });

          var sortedGroupedFilter = _.sortBy(groupedFilter, 'length');
          return sortedGroupedFilter.reverse();
        };

        var updateFilterList = function () {
          userPref.setFilterList('grouping', $scope.selectedGrouping.value);
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
}(angular));
