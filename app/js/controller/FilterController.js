(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('FilterController', [
      '$scope',
      '$q',
      '$stateParams',
      '$timeout',
      '_',
      'getAllRepos',
      'filterProvider',
      function ($scope, $q, $stateParams, $timeout, _, getAllRepos, filterProvider) {
        var filter = null,
          branchList = null,
          contributorList = null,
          repoList = null;

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
          getAllRepos()
            .then(setRepos)
            .then(setScopeVariables);
        }

        function handleExistingFilter() {
          $q.all([filter.getBranchList(), filter.getContributorList(), getAllRepos()])
            .then(function (results) {
              branchList = results[0];
              contributorList = results[1];
              repoList = results[2];
              return $q.when();
            })
            .then(setScopeVariables);
        }

        function setScopeVariables() {
          var repoSetInFilter = filter.getRepo();
          var branchSetInFilter = filter.getBranch();
          var contributorSetInFilter = filter.getAuthors();
          var sinceSetInFilter = filter.getSince();

          $scope.scope = $scope;
          $scope.filter = filter;
          $scope.allRepos = repoList;
          $scope.branches = branchList;
          $scope.contributorList = contributorList;
          $scope.availableFilterSincePattern = ['days', 'weeks', 'years'];

          if($scope.branches){
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
            var selectedConributor = [];
            contributorSetInFilter.forEach(function(name){
              var contributorIndex = _.findIndex($scope.contributorList, {login: name});
              selectedConributor.push($scope.contributorList[contributorIndex]);
            });
            $scope.selectedContributor = selectedConributor;
          }

          if (sinceSetInFilter) {
            $scope.filterSinceAmount = sinceSetInFilter.amount;
            $scope.filterSincePattern = $scope.availableFilterSincePattern[$scope.availableFilterSincePattern.indexOf(sinceSetInFilter.pattern)];
          }

          if($scope.selectedRepo && $scope.selectedBranch) {
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
          $scope.fetchingCommits = false;
          return $q.when();
        }

        function getCommitList() {
          $scope.fetchingCommits = true;
          $scope.commits = [];
          filter.getCommits()
            .then(setCommits);
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
          if (newValue && (newValue !== oldValue)) {
            var updated = false;
            var contributorList = filter.getAuthors();
            var filterSincePattern = filter.getSince().pattern;
            var filterSinceAmount = filter.getSince().amount;

            var selectedContributor = [];
            contributorList.forEach(function(contributor){
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

            $scope.settingsUpdated = updated;
          }
        }

        $scope.updateCommits = function () {
          filter.addAuthor($scope.contributor);
          filter.setSince({
            pattern: $scope.filterSincePattern,
            amount: $scope.filterSinceAmount
          });
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
          setRepos($scope.allRepos);
        };

        isExistingFilter()
          .then(handleExistingFilter, handleNewFilter);
      }
    ]);
}(angular));
