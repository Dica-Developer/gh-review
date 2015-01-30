(function (angular) {
  'use strict';

  angular.module('GHReview')
    .factory('Commit', ['$injector',
      function ($injector) {

        var $q = $injector.get('$q'),
          $interval = $injector.get('$interval'),
          _ = $injector.get('_'),
          commits = $injector.get('commits'),
          comments = $injector.get('comments'),
          Comment = $injector.get('Comment'),
          options = $injector.get('options'),
          Chunk = $injector.get('Chunk');


        function splitInLineAndCommitComments (result, user, repo) {
          var lineComments = _.filter(result, function (comment) {
            return !_.isNull(comment.line) || !_.isNull(comment.position);
          });
          var commitComments = _.where(result, {
            line: null,
            position: null
          });

          lineComments = _.map(lineComments, function (comment) {
            comment.editInformations = {
              user: user,
              repo: repo
            };
            return new Comment(comment);
          });

          commitComments = _.map(commitComments, function (comment) {
            comment.editInformations = {
              user: user,
              repo: repo
            };
            return new Comment(comment);
          });

          return {
            lineComments: lineComments,
            commitComments: commitComments
          };
        }

        function Commit(options) {
          this.options = options;
          this.getCommit = _.memoize(function (githubOptions) {
            var _this = this;
            $interval(function () {
              _this.getCommit.cache = {};
            }, (10 * 60 * 1000)); //10min
            return commits.bySha(githubOptions);
          }, function (githubOptions) {
            return _.values(githubOptions).join('-');
          });
        }

        Commit.prototype.getFiles = function () {
          var defer = $q.defer();
          this.getCommit(this.options)
            .then(function (commit) {
              var files = _.map(commit.files, function (file) {
                var lines = file.patch ? file.patch.split(/\r?\n/) : null,
                /*jshint camelcase: false*/
                  start = file.blob_url.indexOf('blob/') + 'blob/'.length,
                  shaAndPath = file.blob_url.substr(start),
                  end = shaAndPath.indexOf('/'),
                  blobSha = shaAndPath.substr(0, end);

                return {
                  lines: lines ? new Chunk(lines, file.filename) : null,
                  name: file.filename,
                  blobSha: blobSha,
                  additions: file.additions,
                  deletions: file.deletions,
                  changes: file.changes,
                  status: file.status
                };
              });
              defer.resolve(files);
            });
          return defer.promise;
        };

        Commit.prototype.approve = function (user) {
          var defer = $q.defer(),
            self = this;
          var commitState = JSON.stringify({
              version: options.ghReview.version,
              approved: true,
              approver: user.login,
              approvalDate: Date.now()
            }, null, 2),
            comment = '```json\n' + commitState + '\n```\napproved with [gh-review](http://gh-review.herokuapp.com/)';

          comments.addCommitComment(self.options.sha, self.options.user, self.options.repo, comment)
            .then(defer.resolve);
          return defer.promise;
        };

        Commit.prototype.unapprove = function (user) {

          var approvedComment = _.find(this.comments.commitComments, function(comment){
            return comment.getApprover().indexOf(user.login) > -1;
          }, this);

          return approvedComment.remove();
        };

        Commit.prototype.getComments = function(){
          var defer = $q.defer(),
            self = this;
          comments.getForCommit(this.options)
            .then(function(commentResponse){
              self.comments = splitInLineAndCommitComments(commentResponse, self.options.user, self.options.repo);
              defer.resolve(self.comments);
            });
          return defer.promise;
        };

        Commit.prototype.getApprover = function(){
          if(!this.comments){
            return [];
          }
          return _.map(this.comments.commitComments, function(comment){
            return comment.getApprover();
          });
        };

        Commit.prototype.isApprovedByUser = function(user){
          return user ? this.getApprover().indexOf(user.login) > -1 : false;
        };

        //getCommenter


        return Commit;
      }]);

}(angular));