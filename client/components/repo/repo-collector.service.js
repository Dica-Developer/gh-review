(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('repoCollector', ['$q', '$interval', 'github', '_', function ($q, $interval, github, _) {
      var q = $q.defer;

      function RepoCollector() {
        this.getAll = _.memoize(function () {
          var _this = this;
          $interval(function () {
            _this.getAll.cache = {};
          }, (60 * 60 * 1000)); //60min
          return _this.getAllReposFromGithub();
        });
      }

      RepoCollector.prototype.getAllReposFromGithub = function () {
        return this.getOrganizationsForUser()
          .then(this.getReposFromOrganizations.bind(this))
          .then(this.getReposFromUser.bind(this));
      };

      RepoCollector.prototype.getOrganizationsForUser = function () {
        var defer = q();

        github.user.getOrgs({
          'per_page': 100
        }, function (err, result) {
          if (!err) {
            defer.resolve(result);
          } else {
            defer.reject();
          }
        });

        return defer.promise;
      };

      RepoCollector.prototype.getReposFromOrganizations = function (organizations) {
        var defer = q(),
          deferList = [],
          repoList = [];

        organizations.forEach(function (organization) {
          var getRepoDefer = q();
          deferList.push(getRepoDefer.promise);
          github.repos.getFromOrg({
            org: organization.login,
            'per_page': 100
          }, function (err, result) {
            if (!err) {
              repoList = repoList.concat(result);
              getRepoDefer.resolve();
            } else {
              getRepoDefer.reject();
            }
          });
        });

        $q.all(deferList)
          .then(function () {
            defer.resolve(repoList);
          }, defer.reject);
        return defer.promise;
      };

      RepoCollector.prototype.getReposFromUser = function (repoList) {
        var defer = q();

        github.repos.getAll({
          'per_page': 100
        }, function (err, result) {
          if (!err) {
            repoList = repoList.concat(result);
            defer.resolve(repoList);
          } else {
            defer.reject();
          }
        });

        return defer.promise;
      };
      return new RepoCollector();
    }]);
}(angular));