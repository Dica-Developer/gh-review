(function (angular) {
  'use strict';

  angular.module('GHReview')
    .service('repoCollector', ['$q', '$timeout', 'ghUser', 'ghRepos', '_', function ($q, $timeout, ghUser, ghRepos, _) {
      var q = $q.defer;

      function RepoCollector() {
        this.getAll = _.memoize(function () {
          var _this = this;
          $timeout(function () {
            _this.getAll.cache.delete('all-repos');
          }, (60 * 60 * 1000)); //60min
          return _this.getAllReposFromGithub();
        }, function(){
          return 'all-repos';
        });
      }

      RepoCollector.prototype.getAllReposFromGithub = function () {
        return this.getOrganizationsForUser()
          .then(this.getReposFromOrganizations.bind(this))
          .then(this.getReposFromUser.bind(this));
      };

      RepoCollector.prototype.getOrganizationsForUser = function () {
        return ghUser.getOrgs({
          'per_page': 100
        });
      };

      RepoCollector.prototype.getReposFromOrganizations = function (organizations) {
        var defer = q(),
          deferList = [],
          repoList = [];

        organizations.forEach(function (organization) {
          var getRepoDefer = q();
          deferList.push(getRepoDefer.promise);
          ghRepos.getFromOrg({
            org: organization.login,
            'per_page': 100
          }).then(function(repos){
            repoList = repoList.concat(repos);
            getRepoDefer.resolve();
          }, getRepoDefer.reject);
        });

        $q.all(deferList)
          .then(function () {
            defer.resolve(repoList);
          }, defer.reject);
        return defer.promise;
      };

      RepoCollector.prototype.getReposFromUser = function (repoList) {
        var defer = q();
        ghRepos.getAll({
          'per_page': 100
        }).then(function (repos) {
            repoList = repoList.concat(repos);
            defer.resolve(repoList);
        }, defer.reject);
        return defer.promise;
      };
      return new RepoCollector();
    }]);
}(angular));