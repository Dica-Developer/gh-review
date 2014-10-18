(function (angular) {
  'use strict';
  angular.module('GHReview')
    .controller('filterNotificationOptionsModalController', ['$scope', '$modalInstance', '_', 'filter', 'contributorList',function ($scope, $modalInstance, _, filter, contributorList) {

      $scope.scope = $scope;
      $scope.filter = filter;
      $scope.contributorList = contributorList;

      if (filter.options.meta.notifications.branch.authors.length > 0) {
        var selectedContributor = [];
        filter.options.meta.notifications.branch.authors.forEach(function (name) {
          var contributorIndex = _.findIndex($scope.contributorList, {login: name});
          selectedContributor.push($scope.contributorList[contributorIndex]);
        });
        $scope.selectedContributor = selectedContributor;
      }


      $scope.ok = function () {
        filter.options.meta.notifications.branch.authors = _.pluck($scope.selectedContributor, 'login');
        $scope.filter.save();
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
}(angular));
