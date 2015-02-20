(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('FilterController', [
      '$scope',
      '$q',
      '$stateParams',
      '$state',
      '$timeout',
      '_',
      'repoCollector',
      'filter',
      'importExport',
      'Modal',
      function ($scope, $q, $stateParams, $state, $timeout, _, repoCollector, filter, importExport, Modal) {
        var orgFilter = null,
          _filter = null,
          branchList = null,
          contributorList = null,
          repoList = null,
          repoTree = null,
          controller = this;

        controller.isExistingFilter = function () {
          var defer = $q.defer();
          if (!angular.isUndefined($stateParams.filterId)) { //We are in the edit state
            orgFilter = filter.getById($stateParams.filterId);
            _filter = filter.getCloneOf(orgFilter);
            defer.resolve();
          } else {
            _filter = filter.getNew();
            //Set initial to new Filter to reduce commit size
            _filter.setSince({
              pattern: 'weeks',
              amount: 2
            });
            defer.reject();
          }
          return defer.promise;
        };

        controller.handleNewFilter = function () {
          $scope.fetchingRepos = true;
          repoCollector.getAll()
            .then(controller.setRepos)
            .then(controller.setScopeVariables);
        };

        controller.handleExistingFilter = function () {
          /*istanbul ignore next*/
          var setResults = function (results) {
            branchList = results[0];
            contributorList = results[1];
            repoList = results[2];
            repoTree = results[3];
            return $q.when();
          };

          $q.all([_filter.getBranchList(), _filter.getContributorList(), repoCollector.getAll(), _filter.getTree()])
            .then(setResults, function (e) {
              controller.handleError(e);
              return $q.reject();
            })
            .then(controller.setScopeVariables);
        };

        controller.setCurrentPage = function (newValue) {
          _filter.setCurrentPage(newValue);
          controller.setCommits(_filter.getPage());
        };

        controller.setScopeVariables = function () {
          var repoSetInFilter = _filter.getRepo();
          var branchSetInFilter = _filter.getBranch();
          var contributorSetInFilter = _filter.getAuthors();
          var sinceSetInFilter = _filter.getSince();

          $scope.scope = $scope;
          $scope.currentPage = _filter.getCurrentPage();
          $scope.excludeOwnCommits = _filter.getExcludeOwnCommits();
          $scope.filterPath = _filter.getPath();
          $scope.showAdvanced = false;
          $scope.filter = _filter;
          $scope.allRepos = repoList;
          $scope.branches = branchList;
          $scope.contributorList = contributorList;
          $scope.repoTree = repoTree;
          $scope.availableFilterSincePattern = ['days', 'weeks', 'years'];
          $scope.availableFilterReviewStates = ['unseen', 'reviewed', 'approved'];
          $scope.filterReviewState = $scope.availableFilterReviewStates[$scope.availableFilterReviewStates.indexOf(_filter.getState())] || null;

          if ($scope.branches) {
            $scope.branchSelection = _.pluck(branchList, 'name');
          }

          if (repoSetInFilter) {
            $scope.selectedRepo = $scope.allRepos[_.findIndex($scope.allRepos, {name: repoSetInFilter})];
          } else {
            $scope.selectedRepo = null;
          }

          if (repoSetInFilter && branchSetInFilter) {
            $scope.selectedBranch = $scope.branchSelection[_.indexOf($scope.branchSelection, branchSetInFilter)];
          } else {
            $scope.selectedBranch = null;
          }

          if (contributorSetInFilter) {
            var selectedContributor = [];
            contributorSetInFilter.forEach(function (name) {
              var contributorIndex = _.findIndex($scope.contributorList, {login: name});
              selectedContributor.push($scope.contributorList[contributorIndex]);
            });
            $scope.selectedContributor = selectedContributor;
          }

          if (sinceSetInFilter) {
            $scope.filterSinceAmount = sinceSetInFilter.amount;
            $scope.filterSincePattern = $scope.availableFilterSincePattern[$scope.availableFilterSincePattern.indexOf(sinceSetInFilter.pattern)];
          }

          if ($scope.selectedRepo && $scope.selectedBranch) {
            controller.getCommitList();
          } else {
            $scope.commits = null;
          }


          $scope.$watch('selectedBranch', function (newSelectedBranch, oldSelectedBranch) {
            if (newSelectedBranch && newSelectedBranch !== oldSelectedBranch) {
              $scope.commits = [];
              $scope.contributorList = [];
              _filter.setBranch(newSelectedBranch);
              controller.getCommitList();
              controller.getContributorList();
              _filter.getTree()
                .then(function (treeData) {
                  $scope.repoTree = repoTree = treeData;
                });
            }
          });

          $scope.$watch('selectedRepo', function (newSelectedRepo, oldSelectedRepo) {
            if (newSelectedRepo && (newSelectedRepo !== oldSelectedRepo)) {
              _filter.setRepo(newSelectedRepo.name);
              _filter.setOwner(newSelectedRepo.owner.login);
              $scope.branchSelection = [];
              $scope.selectedBranch = null;
              $scope.fetchingBranches = true;
              _filter.getBranchList()
                .then(controller.setBranchSelection);
            }
          });

          $scope.$watch('selectedContributor', controller.checkIfSettingAreUpdated);

          $scope.$watch('filterSinceAmount', controller.checkIfSettingAreUpdated);

          $scope.$watch('filterSincePattern', controller.checkIfSettingAreUpdated);

          $scope.$watch('excludeOwnCommits', controller.checkIfSettingAreUpdated);

          $scope.$watch('filterReviewState', controller.checkIfSettingAreUpdated);

          $scope.$watch('filterPath', controller.checkIfSettingAreUpdated);

          $scope.$watch('currentPage', controller.setCurrentPage);
        };

        controller.setRepos = function (repos) {
          repoList = repos;
          $scope.fetchingRepos = false;
          $q.when();
        };

        controller.setBranchSelection = function (branches) {
          $scope.fetchingBranches = false;
          $scope.branches = branches;
          $scope.branchSelection = _.pluck(branches, 'name');
          /*jshint camelcase:false*/
          $scope.selectedBranch = $scope.branchSelection[_.indexOf($scope.branchSelection, $scope.selectedRepo.default_branch)];
        };

        controller.setCommits = function (commits) {
          $scope.commits = commits;
          $scope.commitsLength = _filter.getTotalCommitsLength();
          $scope.fetchingCommits = false;
          return $q.when();
        };

        controller.handleError = function (error) {
          if (error) {
            error = JSON.stringify(error);
            $scope.error = error;
            $scope.showError = true;
            $scope.showDefaultError = false;
          } else {
            $scope.showError = false;
            $scope.showDefaultError = true;
          }
        };

        controller.getCommitList = function () {
          $scope.fetchingCommits = true;
          $scope.commits = [];
          _filter.getCommits()
            .then(controller.setCommits, controller.handleError, controller.setCommits);
        };

        controller.setContributorList = function (contributorList) {
          $scope.contributorList = contributorList;
          return $q.when();
        };

        controller.getContributorList = function () {
          return _filter.getContributorList()
            .then(controller.setContributorList);
        };

        controller.checkIfSettingAreUpdated = function (newValue, oldValue) {
          var shouldCheck = (typeof newValue !== 'undefined' && newValue !== null && (newValue !== oldValue));

          //We allow null as review state which leads in non filtered results
          if ($scope.availableFilterReviewStates.indexOf(oldValue) > -1 && newValue === null) {
            shouldCheck = true;
          }

          if (shouldCheck) {
            var updated = false;
            var contributorList = _filter.getAuthors();
            var filterSincePattern = _filter.getSince().pattern;
            var filterSinceAmount = _filter.getSince().amount;
            var filterExcludeOwnCommits = _filter.getExcludeOwnCommits();
            var filterReviewState = _filter.getState() || null;
            var filterPath = _filter.getPath();

            var selectedContributor = [];
            contributorList.forEach(function (contributor) {
              selectedContributor.push($scope.contributorList[_.findIndex($scope.contributorList, {login: contributor})]);
            });

            if (!_.isEqual($scope.selectedContributor, selectedContributor)) {
              updated = true;
            }

            if (!_.isEqual(filterSincePattern, $scope.filterSincePattern)) {
              updated = true;
            }

            if (!_.isEqual(filterSinceAmount, $scope.filterSinceAmount)) {
              updated = true;
            }

            if (filterExcludeOwnCommits !== $scope.excludeOwnCommits) {
              updated = true;
            }

            if (!_.isEqual(filterReviewState, $scope.filterReviewState)) {
              updated = true;
            }

            if (!_.isEqual(filterPath, $scope.filterPath)) {
              updated = true;
            }

            $scope.settingsUpdated = updated;
          }
        };

        $scope.updateCommits = function () {
          _filter.addAuthor(_.pluck($scope.selectedContributor, 'login'));
          _filter.setSince({
            pattern: $scope.filterSincePattern,
            amount: $scope.filterSinceAmount
          });
          _filter.setExcludeOwnCommits($scope.excludeOwnCommits);
          _filter.setState($scope.filterReviewState);
          _filter.setPath($scope.filterPath);
          $scope.settingsUpdated = false;
          controller.getCommitList();
        };

        $scope.repoGroupFn = function (item) {
          return item.owner.login;
        };

        $scope.filterIsSaved = function () {
          return _filter.isSaved();
        };

        $scope.saveFilter = function () {
          _filter.save();
        };

        $scope.reset = function () {
          _filter.reset();
          _filter.setSince({
            pattern: 'weeks',
            amount: 2
          });
          $scope.selectedRepo = null;
          $scope.selectedBranch = null;
          $scope.branchSelection = null;
          $scope.contributor = null;
          $scope.contributorList = [];
          $scope.commits = null;
          $scope.repoTree = null;
          controller.setRepos($scope.allRepos);
        };

        $scope.importFilter = function($event, files){
          var selectFilterModal = Modal.selectFilterToImport(function(selectedFilter){
            selectedFilter.forEach(function(filter){
              filter.save();
            });
            $state.go('listFilter');
          });

          importExport.importFilter(files[0])
            .then(function(filterList){
              var newFilter = _.map(filterList, function(settings){
                return filter.getNewFromSettings(settings);
              });
              selectFilterModal(newFilter);
            });
        };

        controller.isExistingFilter()
          .then(controller.handleExistingFilter, controller.handleNewFilter);
      }
    ]);
}(angular));