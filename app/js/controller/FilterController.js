(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('FilterController', [
      '$scope',
      '$q',
      '$stateParams',
      '$timeout',
      '_',
      'repoCollector',
      'filterProvider',
      function ($scope, $q, $stateParams, $timeout, _, repoCollector, filterProvider) {
        var filter = null,
          branchList = null,
          contributorList = null,
          repoList = null,
          repoTree = null;

        function isExistingFilter() {
          var defer = $q.defer();
          if (!angular.isUndefined($stateParams.filterId)) { //We are in the edit state
            filter = filterProvider.get($stateParams.filterId);
            defer.resolve();
          } else {
            filter = filterProvider.getNew();
            //Set initial to new Filter to reduce commit size
            filter.setSince({
              pattern: 'weeks',
              amount: 2
            });
            defer.reject();
          }
          return defer.promise;
        }

        function handleNewFilter() {
          $scope.fetchingRepos = true;
          repoCollector.getAll()
            .then(setRepos)
            .then(setScopeVariables);
        }

        function handleExistingFilter() {
          $q.all([filter.getBranchList(), filter.getContributorList(), repoCollector.getAll(), filter.getTree()])
            .then(function (results) {
              branchList = results[0];
              contributorList = results[1];
              repoList = results[2];
              repoTree = results[3];
              return $q.when();
            })
            .then(setScopeVariables);
        }

        function setCurrentPage(newValue) {
          filter.setCurrentPage(newValue);
          setCommits(filter.getPage());
        }

        function setScopeVariables() {
          var repoSetInFilter = filter.getRepo();
          var branchSetInFilter = filter.getBranch();
          var contributorSetInFilter = filter.getAuthors();
          var sinceSetInFilter = filter.getSince();

          $scope.scope = $scope;
          $scope.currentPage = filter.getCurrentPage();
          $scope.excludeOwnCommits = filter.getExcludeOwnCommits();
          $scope.filterPath = filter.getPath();
          $scope.showAdvanced = false;
          $scope.filter = filter;
          $scope.allRepos = repoList;
          $scope.branches = branchList;
          $scope.contributorList = contributorList;
          $scope.repoTree = repoTree;
          $scope.availableFilterSincePattern = ['days', 'weeks', 'years'];
          $scope.availableFilterReviewStates = ['unseen', 'reviewed', 'approved'];
          $scope.filterReviewState = $scope.availableFilterReviewStates[$scope.availableFilterReviewStates.indexOf(filter.getState())] || null;

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
            getCommitList();
          } else {
            $scope.commits = null;
          }


          $scope.$watch('selectedBranch', function (newSelectedBranch, oldSelectedBranch) {
            if (newSelectedBranch && newSelectedBranch !== oldSelectedBranch) {
              $scope.commits = [];
              $scope.contributorList = [];
              filter.setBranch(newSelectedBranch);
              getCommitList();
              getContributorList();
              filter.getTree()
                .then(function (treeData) {
                  $scope.repoTree = repoTree = treeData;
                });
            }
          });

          $scope.$watch('selectedRepo', function (newSelectedRepo, oldSelectedRepo) {
            if (newSelectedRepo && (newSelectedRepo !== oldSelectedRepo)) {
              filter.setRepo(newSelectedRepo.name);
              filter.setOwner(newSelectedRepo.owner.login);
              $scope.branchSelection = [];
              $scope.selectedBranch = null;
              $scope.fetchingBranches = true;
              filter.getBranchList()
                .then(setBranchSelection);
            }
          });

          $scope.$watch('selectedContributor', checkIfSettingAreUpdated);

          $scope.$watch('filterSinceAmount', checkIfSettingAreUpdated);

          $scope.$watch('filterSincePattern', checkIfSettingAreUpdated);

          $scope.$watch('excludeOwnCommits', checkIfSettingAreUpdated);

          $scope.$watch('filterReviewState', checkIfSettingAreUpdated);

          $scope.$watch('filterPath', checkIfSettingAreUpdated);

          $scope.$watch('currentPage', setCurrentPage);
        }

        function setRepos(repos) {
          repoList = repos;
          $scope.fetchingRepos = false;
          $q.when();
        }

        function setBranchSelection(branches) {
          $scope.fetchingBranches = false;
          $scope.branches = branches;
          $scope.branchSelection = _.pluck(branches, 'name');
          /*jshint camelcase:false*/
          $scope.selectedBranch = $scope.branchSelection[_.indexOf($scope.branchSelection, $scope.selectedRepo.default_branch)];
        }

        function setCommits(commits) {
          $scope.commits = commits;
          $scope.commitsLength = filter.getTotalCommitsLength();
          $scope.fetchingCommits = false;
          return $q.when();
        }

        function getCommitList() {
          $scope.fetchingCommits = true;
          $scope.commits = [];
          filter.getCommits()
            .then(setCommits, null, setCommits);
        }

        function setContributorList(contributorList) {
          $scope.contributorList = contributorList;
          return $q.when();
        }

        function getContributorList() {
          return filter.getContributorList()
            .then(setContributorList);
        }

        function checkIfSettingAreUpdated(newValue, oldValue) {
          var shouldCheck = (typeof newValue !== 'undefined' && newValue !== null && (newValue !== oldValue));

          //We allow null as review state which leads in non filtered results
          if ($scope.availableFilterReviewStates.indexOf(oldValue) > -1 && newValue === null) {
            shouldCheck = true;
          }

          if (shouldCheck) {
            var updated = false;
            var contributorList = filter.getAuthors();
            var filterSincePattern = filter.getSince().pattern;
            var filterSinceAmount = filter.getSince().amount;
            var filterExcludeOwnCommits = filter.getExcludeOwnCommits();
            var filterReviewState = filter.getState() || null;
            var filterPath = filter.getPath();

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
        }

        $scope.updateCommits = function () {
          filter.addAuthor(_.pluck($scope.selectedContributor, 'login'));
          filter.setSince({
            pattern: $scope.filterSincePattern,
            amount: $scope.filterSinceAmount
          });
          filter.setExcludeOwnCommits($scope.excludeOwnCommits);
          filter.setState($scope.filterReviewState);
          filter.setPath($scope.filterPath);
          $scope.settingsUpdated = false;
          getCommitList();
        };

        $scope.repoGroupFn = function (item) {
          return item.owner.login;
        };

        $scope.filterIsSaved = function () {
          return filter.isSaved();
        };

        $scope.saveFilter = function () {
          filter.save();
        };

        $scope.reset = function () {
          filter.reset();
          filter.setSince({
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
          setRepos($scope.allRepos);
        };

        isExistingFilter()
          .then(handleExistingFilter, handleNewFilter);
      }
    ]);
}(angular));
