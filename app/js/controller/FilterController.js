define(['angular', 'controllers', 'lodash'], function (angular, controllers, _) {
  'use strict';

  controllers
    .controller('FilterController', [
      '$scope',
      '$stateParams',
      'getAllReposAndBranches',
      'getTreeData',
      'Charts',
      'Filter',
      'commentCollector',
      function ($scope, $stateParams, getAllReposAndBranches, getTreeData, Charts, Filter, commentCollector) {
        var filter = null;
        if ($stateParams.filterId) {
          filter = new Filter($stateParams.filterId);
        } else {
          filter = new Filter();
        }
        var charts = new Charts();
        var updateCommitsTimeout = null;

        getAllReposAndBranches()
          .then(charts.addRepoCharts.bind(charts));

        $scope.filter = filter.options;
        $scope.branches = null;
        $scope.selectedBranch = null;
        $scope.sinceAmount = 2;
        $scope.sincePatterns = [{
          display: 'Days',
          value: 'days'
        }, {
          display: 'Weeks',
          value: 'weeks'
        }, {
          display: 'Years',
          value: 'years'
        }];
        $scope.sincePattern = $scope.sincePatterns[1];

        $scope.save = function () {
          filter.save();
        };

        $scope.selectRepo = function (event) {
          /*jshint camelcase: false */
          var data = event.target.__data__;
          var table = angular.element(event.currentTarget);
          table.find('.success').removeClass('success');

          var tr = angular.element(event.target.parentNode);
          tr.addClass('success');
          $scope.branches = data.branches;
          $scope.selectedBranch = _.find(data.branches, {
            name: 'master'
          });
          filter.setRepo(data.name);
          filter.setOwner(data.owner.login);
          filter.setBranch($scope.selectedBranch.name);
          $scope.updated = new Date().getTime();
          getTree();
        };

        var filterComplete = function () {
          var sha = _.isUndefined(filter.getBranch()) || _.isNull(filter.getBranch());
          var repo = _.isUndefined(filter.getRepo()) || _.isNull(filter.getRepo());
          var user = _.isUndefined(filter.getOwner()) || _.isNull(filter.getOwner());
          var since = _.isUndefined(filter.getSince()) || _.isNull(filter.getSince());
          return (!sha && !repo && !user && !since);
        };

        var changeFilterSinceSettings = function (newValue) {
          if (!_.isUndefined(newValue) && !_.isNull(newValue)) {
            //TODO move since pattern handling to Filter
            filter.setSince({
              amount: $scope.sinceAmount,
              pattern: $scope.sincePattern.value
            });
            $scope.updated = new Date().getTime();
          }
        };

        var getTree = function () {
          if (filterComplete()) {
            var user = filter.getOwner();
            var repo = filter.getRepo();
            var sha = filter.getBranch();
            getTreeData(user, repo, sha)
              .then(function (data) {
                $scope.tree = data.tree;
              });
          }
        };

        $scope.$watch('sinceAmount', changeFilterSinceSettings);
        $scope.$watch('sincePattern', changeFilterSinceSettings);
        $scope.$watch('filter.sha', getTree);

        var updateCommits = function (newValue) {
          if (filterComplete() && (!_.isUndefined(newValue) && !_.isNull(newValue))) {
            clearTimeout(updateCommitsTimeout);
            updateCommitsTimeout = setTimeout(function () {
              filter.getCommits()
                .then(function (result) {
                  var timeChartWidth = document.getElementById('timeWindowFilter').offsetWidth;
                  var otherChartsWidth = document.getElementById('commitFilterCharts').offsetWidth;
                  charts.processCommitData(result);
                  charts.timeChart(timeChartWidth, 150);
                  charts.commitsPerAuthorChart(otherChartsWidth, 150);
                  commentCollector.announceRepositoryAndWaitForFinish(filter)
                    .then(commentCollector.getCommitApproved)
                    .then(function (commitApproved) {
                      charts.proccessCommentData(commitApproved);
                      charts.reviewStateChart(otherChartsWidth, 150);
                    });
                });
            }, 1000);
          }
        };

        $scope.$watch('updated', _.debounce(updateCommits, 500));

        $scope.$on('filter:change:state', function (event, state) {
          var filterState = '';
          switch (state) {
          case 'Not Reviewed':
            filterState = 'unseen';
            break;
          case 'Not Approved':
            filterState = 'reviewed';
            break;
          case 'Approved':
            filterState = 'approved';
            break;
          default:
            throw new Error('Unknown state: ' + state);
          }
        });

        $scope.$on('filter:change:author', function (event, author) {
          if (filter.hasAuthor(author)) {
            filter.removeAuthor(author);
          } else {
            filter.addAuthor(author);
          }
        });
      }
    ]);
});
