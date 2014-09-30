(function (angular) {
  'use strict';

  angular.module('GHReview')
    .controller('FilterController', [
      '$scope',
      '$stateParams',
      '_',
      'getAllRepos',
      'getBranchesForRepo',
      'Filter',
      function ($scope, $stateParams, _, getAllRepos, getBranchesForRepo, Filter) {
        var filter = new Filter();

        //Set initial to new Filter to reduce commit size
        filter.setSince({
          pattern: 'weeks',
          amount: 2
        });
        $scope.scope = $scope;

        $scope.allRepos = false;
        $scope.selectedRepo = null;
        $scope.selectedBranch = null;
        $scope.branchSelection = null;
        $scope.contributor = null;
        $scope.contributorList = null;
        $scope.commits = null;

        $scope.fetchingRepos = true;
        $scope.fetchingBranches = false;
        $scope.fetchingCommits = true;

        $scope.availableFilterSincePattern = ['days', 'weeks', 'years'];
        $scope.filterSinceAmount = filter.getSince().amount;
        $scope.filterSincePattern = $scope.availableFilterSincePattern[_.indexOf($scope.availableFilterSincePattern, filter.getSince().pattern)];

        function setRepos(repos) {
          $scope.allRepos = repos;
          $scope.fetchingRepos = false;
        }

        function setBranchSelection(branches) {
          $scope.fetchingBranches = false;
          $scope.branches = branches;
          $scope.branchSelection = _.pluck(branches, 'name');
          /*jshint camelcase:false*/
          $scope.selectedBranch = $scope.branchSelection[_.indexOf($scope.branchSelection, $scope.selectedRepo.default_branch)];
        }

        function getCommitList() {
          $scope.fetchingCommits = true;
          $scope.commits = [];
          filter.getCommits()
            .then(function(commits){
              $scope.commits = commits;
              $scope.fetchingCommits = false;
            });
        }

        function getContributorList() {
          filter.getContributorList()
            .then(function(contributorList){
              $scope.contributorList = contributorList;
            });
        }

        function checkIfSettingAreUpdated(newValue, oldValue) {
          if(newValue && !_.isNull(oldValue) && newValue !== oldValue){
            var updated = false;
            var contributor = filter.getAuthors();
            var filterSincePattern = filter.getSince().pattern;
            var filterSinceAmount = filter.getSince().amount;

            if(!_.isEqual($scope.contributor, contributor)){
              updated = true;
            }

            if(!_.isEqual(filterSincePattern, $scope.filterSincePattern)){
              updated = true;
            }

            if(!_.isEqual(filterSinceAmount, $scope.filterSinceAmount)){
              updated = true;
            }

            $scope.settingsUpdated = updated;
          }
        }

        $scope.updateCommits = function(){
          filter.addAuthor($scope.contributor);
          filter.setSince({
            pattern: $scope.filterSincePattern,
            amount: $scope.filterSinceAmount
          });
          $scope.settingsUpdated = false;
          getCommitList();
        };

        $scope.$watch('selectedRepo', function (newSelectedRepo) {
          if(newSelectedRepo){
            filter.setRepo(newSelectedRepo.name);
            filter.setOwner(newSelectedRepo.owner.login);
            $scope.branchSelection = [];
            $scope.selectedBranch = null;
            $scope.fetchingBranches = true;
            /*jshint camelcase:false*/
            getBranchesForRepo(newSelectedRepo.full_name)
              .then(setBranchSelection);
          }
        });

        $scope.$watch('selectedBranch', function (newSelectedBranch) {
          if(newSelectedBranch) {
            $scope.commits = [];
            $scope.contributorList = [];
            filter.setBranch(newSelectedBranch);
            getCommitList();
            getContributorList();
          }
        });

        $scope.$watch('contributor', checkIfSettingAreUpdated);

        $scope.$watch('filterSinceAmount', checkIfSettingAreUpdated);

        $scope.$watch('filterSincePattern', checkIfSettingAreUpdated);

        $scope.repoGroupFn = function (item){
          return item.owner.login;
        };

        $scope.filterIsSaved = function (){
          return filter.isSaved();
        };

        $scope.saveFilter = function (){
          filter.save();
        };

        $scope.reset = function (){
          filter.reset();
          filter.setSince({
            pattern: 'weeks',
            amount: 2
          });
          $scope.selectedRepo = null;
          $scope.selectedBranch = null;
          $scope.branchSelection = null;
          $scope.contributor = null;
          $scope.contributorList = null;
          $scope.commits = null;
          setRepos($scope.allRepos);
        };

        getAllRepos()
          .then(setRepos);
      }
    ]);
}(angular));
