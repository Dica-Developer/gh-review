(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('FilterListController', ['$scope', '$state', '$log', '_', 'filter', 'events', 'userPref', 'importExport', 'Modal',
      function ($scope, $state, $log, _, filter, events, userPref, importExport, Modal) {
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

        $scope.standup = function (filterId, event) {
          if (void 0 !== event) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
          $state.go('standup', {
            'filterId': filterId
          });
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

        $scope.exportName = 'gh-review-filter.json';
        $scope.exportFilter = function(){
          var allFilter = _.map(filter.getAll(), function(filter){
            return JSON.parse(JSON.stringify(filter.options));
          });
          importExport.exportFilter($scope.exportName, allFilter);
        };

        $scope.importFilter = function($event, files){
          var selectFilterModal = Modal.selectFilterToImport(function(selectedFilter){
            selectedFilter.forEach(function(filter){
              filter.save();
            });
            updateFilterList();
          });

          importExport.importFilter(files[0])
            .then(function(filterList){
              var newFilter = _.map(filterList, filter.getNewFromSettings, filter);
              selectFilterModal(newFilter);
            });
        };

        //TODO refactor to be a bit more generic, maybe moving to filterUtils
        $scope.getErrorDescription = function(filter){
          var error = filter.healthCheckError,
            description = '';

          if(error && error.message){
            var message = JSON.parse(error.message);
            if(message.message.indexOf('Branch not found') > -1){
              description = 'Could not find branch: "'+ filter.getBranch() +'". Maybe deleted or renamed.';
            }
          }
          return description;
        };

        $scope.getErrorTitle = function(filter){
          var error = filter.healthCheckError,
            title = '';

          if(error && error.message){
            var message = JSON.parse(error.message);
            title = message.message;
          }
          return title;
        };

        $scope.$watch('selectedGrouping', updateFilterList);
        updateFilterList();
      }
    ]);
}(angular));
