/*global console*/
(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('FilterController', [
      '$scope', '$state', '$stateParams', '$timeout', 'filter', 'repoList', '_', 'importExport', 'Modal', 'limitToFilter',
      function ($scope, $state, $stateParams, $timeout, filter, repoList, _, importExport, Modal, limitToFilter) {
        var getCommitsTimeout = null;
        $scope.filter = filter.getById($stateParams.filterId);

        $scope.scope = $scope;
        $scope.repoList = repoList;
        $scope.branchList = [];
        $scope.commits = [];
        $scope.currentPage = 1;
        $scope.availableFilterSincePattern = ['days', 'weeks', 'years'];
        $scope.availableFilterReviewStates = ['unseen', 'reviewed', 'approved'];
        $scope.showAdvanced = false;

        $scope.filterIsSaved = $scope.filter.isSaved.bind($scope.filter);
        $scope.saveFilter = $scope.filter.save.bind($scope.filter);
        $scope.saveFilterAsNew = $scope.filter.saveAsNew.bind($scope.filter);

        $scope.getRepoTree = function(filterValue){
          return $scope.filter.getTree()
            .then(function(repoTree){
              var filteredTree = repoTree.filter(function(treeEntry){
                var regEx = new RegExp(filterValue, 'gi');
                return regEx.test(treeEntry.path);
              });
              return limitToFilter(filteredTree, 15);
            });
        };

        $scope.pathSelected = function(pathObject, path){
          $scope.selectedPath = path;
        };

        function setBranchList(branchList) {
          $scope.branchList = _.pluck(branchList, 'name');
          /*jshint camelcase:false*/
          var selectedBranchIndex = $scope.branchList.indexOf($scope.filter.getBranch());
          if (selectedBranchIndex === -1) {
            selectedBranchIndex = $scope.branchList.indexOf($scope.selectedRepo.default_branch);
          }
          $scope.selectedBranch = $scope.branchList[selectedBranchIndex];
        }

        function handleGetBranchError(error) {
          console.log(error);
        }

        function setContributorList(contributorList) {
          $scope.contributorList = contributorList;
          $scope.selectedContributor = [];
          $scope.filter.getAuthors().forEach(function (name) {
            var contributorIndex = _.findIndex($scope.contributorList, {login: name});
            $scope.selectedContributor.push($scope.contributorList[contributorIndex]);
          });
        }

        function handleGetContributorError(error) {
          console.log(error);
        }

        function setCommitList(commitList) {
          $scope.commits = commitList;
          $scope.commitsLength = $scope.filter.getTotalCommitsLength();
          $scope.currentPage = $scope.filter.getCurrentPage();
        }

        function handleGetCommitsError(error) {
          console.log(error);
        }

        function startUp(){
          $scope.filterSinceAmount = $scope.filter.getSince().amount;
          $scope.filterSincePattern = $scope.availableFilterSincePattern[$scope.availableFilterSincePattern.indexOf($scope.filter.getSince().pattern)];
          $scope.filterPath = $scope.filter.getPath();

          if (!$scope.filter.isNew()) {
            $scope.selectedRepo = $scope.repoList[_.findIndex($scope.repoList, {name: $scope.filter.getRepo()})];
            $scope.filterReviewState = $scope.availableFilterReviewStates[$scope.availableFilterReviewStates.indexOf($scope.filter.getState())] || null;
            $scope.excludeOwnCommits = $scope.filter.getExcludeOwnCommits();

            $scope.filter.getBranchList().then(setBranchList, handleGetBranchError);
            $scope.filter.getContributorList().then(setContributorList, handleGetContributorError);
            $scope.filter.getCommits().then(setCommitList, handleGetCommitsError, setCommitList);
          } else {
            $scope.selectedRepo = null;
            $scope.selectedBranch = null;
            $scope.selectedContributor = null;
            $scope.contributorList = [];
            $scope.excludeOwnCommits = false;
          }
        }

        $scope.reset = function () {
          $scope.filter.reset();
          $scope.branchList = [];
          $scope.commits = [];
          $scope.currentPage = 1;
          startUp();
        };

        $scope.importFilter = function ($event, files) {
          //TODO change modal to allow to import exactly one filter and apply the settings afterwards directly to this view
          var selectFilterModal = Modal.selectFilterToImport(function (selectedFilter) {
            $scope.filter = selectedFilter;
            startUp();
          });

          importExport.importFilter(files[0])
            .then(function (filterList) {
              var newFilter = _.map(filterList, function (settings) {
                return filter.getNewFromSettings(settings);
              });
              selectFilterModal(newFilter);
            });
        };

        $scope.$watch('selectedRepo', function (newRepo, oldRepo) {
          if (!_.isEqual(newRepo, oldRepo) && !_.isNull(newRepo)) {
            $scope.filter.setRepo(newRepo.name);
            $scope.filter.setOwner(newRepo.owner.login);
            $scope.filter.setBranch(null);
            $scope.filter.unsetAuthors();
            $scope.filter.unsetPath();
            $scope.filter.getBranchList().then(setBranchList, handleGetBranchError);
            $scope.filter.getContributorList().then(setContributorList, handleGetContributorError);
          }
        });

        $scope.$watch('selectedBranch', function (newBranch, oldBranch) {
          if (!_.isEqual(newBranch, oldBranch) && !_.isNull(newBranch) && !_.isUndefined(oldBranch)) {
            $scope.filter.setBranch(newBranch);
            $scope.filter.unsetPath();
          }
        });

        $scope.$watch('selectedContributor', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue) && !_.isUndefined(oldValue)) {
            $scope.filter.addAuthor(_.pluck($scope.selectedContributor, 'login'));
          }
        });

        $scope.$watch('filterSinceAmount', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue)) {
            $scope.filter.setSince({amount: newValue, pattern: $scope.filterSincePattern});
          }
        });

        $scope.$watch('filterSincePattern', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue)) {
            $scope.filter.setSince({amount: $scope.filterSinceAmount, pattern: newValue});
          }
        });

        $scope.$watch('excludeOwnCommits', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue)) {
            $scope.filter.setExcludeOwnCommits(newValue);
          }
        });

        $scope.$watch('filterReviewState', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue)) {
            $scope.filter.setState(newValue);
          }
        });

        $scope.$watch('selectedPath', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue)) {
            $scope.filter.setPath(newValue);
          }
        });

        $scope.$watch('filterPath', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue) && newValue === '') {
            $scope.filter.setPath(newValue);
          }
        });

        $scope.$watch('currentPage', function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue)) {
            $scope.filter.setCurrentPage(newValue);
          }
        });

        $scope.$watch(function () {
          return $scope.filter.lastEdited();
        }, function (newValue, oldValue) {
          if (!_.isEqual(newValue, oldValue) && !_.isNull(newValue)) {
            $timeout.cancel(getCommitsTimeout);
            getCommitsTimeout = $timeout(function () {
              $scope.filter.getCommits().then(setCommitList, handleGetCommitsError, setCommitList);
            }, 1000);
          }
        });

        startUp();
      }]);
}(angular));

/*
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
*/